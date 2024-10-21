import { useState, useEffect, useCallback, useRef } from "react"
import { saveStationData, saveLineData } from "@/lib/model"

const WS_URL = 'ws://localhost:8080'

// Definir los tipos
interface StationData {
  hour: number;
  passengers: number;
}

interface StationsData {
  [key: string]: StationData[];
}

interface Alarm {
  id: string;
  time: string;
  type: string;
  location: string;
  message: string;
  acknowledged: boolean;
}

interface WebSocketData {
  fecha: string;
  hora: number;
  estaciones: {
    nombre: string;
    pasajeros: number;
    historial: StationData[];
  }[];
  alertas: string[];
  totalLinea4A: number;
}

export function useWebSocket() {
  const [wsError, setWsError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [stationsData, setStationsData] = useState<StationsData>({})
  const [lineData, setLineData] = useState<StationData[]>([])
  const [alerts, setAlerts] = useState<Alarm[]>([])
  const [globalCount, setGlobalCount] = useState(0)
  const [isSimulationRunning, setIsSimulationRunning] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  const handleWebSocketMessage = useCallback((data: WebSocketData) => {
    try {
      const currentDate = new Date(data.fecha)

      if (currentDate.getDate() !== new Date().getDate()) {
        setLineData([]) // Limpiar datos si es un nuevo día
      }

      const newStationsData: StationsData = {}
      data.estaciones.forEach((estacion) => {
        newStationsData[estacion.nombre] = estacion.historial
      })

      setStationsData(newStationsData)

      const processedAlerts: Alarm[] = data.alertas.map((alerta, index) => ({
        id: `alert-${index}`,
        time: new Date().toISOString(),
        type: "General",
        location: "Unknown",
        message: alerta,
        acknowledged: false
      }))

      setAlerts(processedAlerts)
      setGlobalCount(data.totalLinea4A)
      setCurrentTime(currentDate)
      setLineData((prevData) => {
        const newData = [...prevData, {
          hour: data.hora,
          passengers: data.totalLinea4A
        }].slice(-24)
        return newData
      })

      // Guardar datos en Firestore
      const dateStr = currentDate.toISOString().split('T')[0]
      const hourStr = data.hora.toString()
      data.estaciones.forEach((estacion) => {
        saveStationData(estacion.nombre, dateStr, hourStr, {
          passengers: estacion.pasajeros,
          alarms: []
        })
      })

      saveLineData("L4A", dateStr, hourStr, {
        totalPassengers: data.totalLinea4A,
        alarms: processedAlerts
      })
    } catch (error) {
      console.error('Error processing WebSocket message:', error)
      setWsError('Error processing data. Please check the data format.')
    }
  }, [])

  const handleStartSimulation = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send('iniciar')
      setIsSimulationRunning(true)
      setLineData([])
    } else {
      setWsError('WebSocket is not connected.')
    }
  }, [])

  const handleStopSimulation = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send('detener')
      setIsSimulationRunning(false)
    } else {
      setWsError('WebSocket is not connected.')
    }
  }, [])

  useEffect(() => {
    wsRef.current = new WebSocket(WS_URL)

    wsRef.current.onopen = () => {
      console.log('Connected to WebSocket')
      setWsError(null) // Limpiar cualquier error de conexión anterior
    }

    wsRef.current.onmessage = (event) => {
      try {
        const data: WebSocketData = JSON.parse(event.data)
        handleWebSocketMessage(data)
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
        setWsError('Error parsing data. Please check the format.')
      }
    }

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error)
      setWsError('Connection error. Please reload the page.')
    }

    const timer = setInterval(() => setCurrentTime(new Date()), 1000)

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      clearInterval(timer)
    }
  }, [handleWebSocketMessage])

  return {
    wsError,
    currentTime,
    stationsData,
    lineData,
    alerts,
    globalCount,
    isSimulationRunning,
    handleStartSimulation,
    handleStopSimulation
  }
}
