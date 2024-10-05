"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Component() {
  const [selectedStation, setSelectedStation] = useState("La Cisterna")
  const [stationData, setStationData] = useState([])
  const [lineData, setLineData] = useState([])
  const [alertas, setAlertas] = useState([])

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('Conectado al WebSocket');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Datos recibidos:', data);
      setLineData(data.estaciones.map(e => ({ hour: data.hora, passengers: e.pasajeros })));
      const selectedStationData = data.estaciones.find(e => e.nombre === selectedStation);
      setStationData(selectedStationData ? selectedStationData.historial : []);
      setAlertas(data.alertas);
    };

    ws.onerror = (error) => {
      console.error('Error en WebSocket:', error);
    };

    return () => {
      ws.close();
    };
  }, [selectedStation]);

  const handleStationChange = (value: string) => {
    setSelectedStation(value);
  }

  const formatXAxis = (tickItem: number) => {
    return `${tickItem}:00`;
  }

  return (
    <div className="space-y-8 p-8">
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
              <LineChart data={stationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tickFormatter={formatXAxis} />
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
                <XAxis dataKey="hour" tickFormatter={formatXAxis} />
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