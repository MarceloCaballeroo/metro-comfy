"use client"

import { useState, useEffect, useRef } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface StationData {
  hour: number;
  passengers: number;
}

interface StationsData {
  [key: string]: StationData[];
}

export default function Component() {
  const [selectedStation, setSelectedStation] = useState("La Cisterna")
  const [stationsData, setStationsData] = useState<StationsData>({})
  const [lineData, setLineData] = useState<StationData[]>([])
  const [alertas, setAlertas] = useState<string[]>([])
  const [isSimulationRunning, setIsSimulationRunning] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    wsRef.current = new WebSocket('ws://localhost:8080');

    wsRef.current.onopen = () => {
      console.log('Conectado al WebSocket');
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Datos recibidos:', data);
      setLineData(prevData => [...prevData, { hour: data.hora, passengers: data.totalLinea4A }].slice(-18));
      setStationsData(prevData => {
        const newData: StationsData = { ...prevData };
        data.estaciones.forEach((estacion: { nombre: string; historial: StationData[] }) => {
          newData[estacion.nombre] = estacion.historial.filter((d: StationData) => d.hour >= 6 && d.hour <= 23);
        });
        return newData;
      });
      setAlertas(data.alertas);
    };

    wsRef.current.onerror = (error) => {
      console.error('Error en WebSocket:', error);
    };

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const handleStationChange = (value: string) => {
    setSelectedStation(value);
  }

  const formatXAxis = (tickItem: number) => {
    return `${tickItem}:00`;
  }

  const handleStartSimulation = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send('iniciar');
      setIsSimulationRunning(true);
      setLineData([]); // Limpiar datos anteriores
      setStationsData({}); // Limpiar datos de estaciones
    }
  }

  const handleStopSimulation = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send('detener');
      setIsSimulationRunning(false);
    }
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <Button onClick={handleStartSimulation} disabled={isSimulationRunning}>
          Iniciar Simulación
        </Button>
        <Button onClick={handleStopSimulation} disabled={!isSimulationRunning}>
          Detener Simulación
        </Button>
      </div>

      {alertas.map((alerta, index) => (
        <Alert key={index} variant="destructive">
          <AlertTitle>Alerta</AlertTitle>
          <AlertDescription>{alerta}</AlertDescription>
        </Alert>
      ))}

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Tráfico por estación: {selectedStation}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select onValueChange={handleStationChange} value={selectedStation}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar estación" />
              </SelectTrigger>
              <SelectContent>
                {["La Cisterna", "San Ramón", "Santa Rosa", "La Granja", "Santa Julia", "Vicuña Mackenna"].map((station) => (
                  <SelectItem key={station} value={station}>
                    {station}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ChartContainer
            config={{
              passengers: {
                label: "Pasajeros",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stationsData[selectedStation] || []} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="hour" 
                  tickFormatter={formatXAxis} 
                  domain={[6, 23]} 
                  type="number"
                  ticks={[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]}
                />
                <YAxis domain={[0, 'dataMax + 10000']} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="passengers" stroke="var(--color-passengers)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Tráfico general de la línea</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              passengers: {
                label: "Pasajeros",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tickFormatter={formatXAxis} domain={[6, 23]} />
                <YAxis domain={[0, 'dataMax + 10000']} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="passengers" stroke="var(--color-passengers)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}