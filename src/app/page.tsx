"use client"

import { useState, useEffect, useRef } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react" // Settings, Calendar
import { useTheme } from "next-themes"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

interface StationData {
  hour: number;
  passengers: number;
}

interface StationsData {
  [key: string]: StationData[];
}

export default function SubwayDashboard() {
  const { theme, setTheme } = useTheme();
  const [selectedStation, setSelectedStation] = useState("La Cisterna")
  const [stationsData, setStationsData] = useState<StationsData>({})
  const [lineData, setLineData] = useState<StationData[]>([])
  const [alertas, setAlertas] = useState<string[]>([])
  const [isSimulationRunning, setIsSimulationRunning] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [globalCount, setGlobalCount] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
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
      setGlobalCount(data.totalLinea4A);
    };

    wsRef.current.onerror = (error) => {
      console.error('Error en WebSocket:', error);
    };

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      if (wsRef.current) wsRef.current.close();
      clearInterval(timer);
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
      setLineData([]);
      setStationsData({});
    }
  }

  const handleStopSimulation = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send('detener');
      setIsSimulationRunning(false);
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Metro Comfy</h1>
          <div className="flex space-x-4">
            <Button variant="ghost" onClick={() => setActiveTab("dashboard")}>Dashboard</Button>
            <Button variant="ghost" onClick={() => setActiveTab("alerts")}>Alertas</Button>
            <Button variant="ghost" onClick={() => setActiveTab("history")}>Historial</Button>
            <Button variant="ghost" onClick={() => setActiveTab("settings")}>Ajustes</Button>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto p-4">
        <Card className="mb-8">
          <CardContent className="flex justify-center items-center p-6">
            <h2 className="text-6xl font-bold">
              {currentTime.toLocaleTimeString()}
            </h2>
          </CardContent>
        </Card>

        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pasajeros globales</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{globalCount.toLocaleString()}</p>
                </CardContent>
              </Card>
              {Object.keys(stationsData).map((station) => (
                <Card key={station}>
                  <CardHeader>
                    <CardTitle>{station}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold">
                      {stationsData[station][stationsData[station].length - 1]?.passengers.toLocaleString() || 0}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Button onClick={handleStartSimulation} disabled={isSimulationRunning}>
                Iniciar Simulación
              </Button>
              <Button onClick={handleStopSimulation} disabled={!isSimulationRunning}>
                Detener Simulación
              </Button>
            </div>
            
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
        )}

        {activeTab === "alerts" && (
          <Card className={alertas.length > 0 ? "bg-red-100 dark:bg-red-900" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className={`mr-2 ${alertas.length > 0 ? "text-red-500" : ""}`} />
                Alertas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertas.length > 0 ? (
                  alertas.map((alerta, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Bell className="text-red-500" />
                      <p>{alerta}</p>
                    </div>
                  ))
                ) : (
                  <p>No hay alertas activas en este momento.</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "history" && (
          <Card>
            <CardHeader>
              <CardTitle>Historial</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
                {selectedDate && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Datos para {selectedDate.toLocaleDateString()}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Pasajeros totales: {Math.floor(Math.random() * 1000000).toLocaleString()}</p>
                      <p>Alertas: {Math.floor(Math.random() * 10)}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "settings" && (
          <Card>
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Modo Oscuro</span>
                  <Button variant="outline" onClick={toggleTheme}>
                    {theme === "dark" ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Notificaciones</span>
                  <Button variant="outline">Configurar</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tasa de actualización de datos</span>
                  <Select defaultValue="5">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Seleccionar tasa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Cada 1 minuto</SelectItem>
                      <SelectItem value="5">Cada 5 minutos</SelectItem>
                      <SelectItem value="15">Cada 15 minutos</SelectItem>
                      <SelectItem value="30">Cada 30 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <footer className="bg-primary text-primary-foreground p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Metro Comfy. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}