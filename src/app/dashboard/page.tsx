"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useWebSocket } from "@/hooks/use-websocket"

const STATIONS = ["La Cisterna", "San Ramón", "Santa Rosa", "La Granja", "Santa Julia", "Vicuña Mackenna"];

export default function DashboardPage() {
  const { 
    stationsData, 
    lineData, 
    isSimulationRunning, 
    handleStartSimulation, 
    handleStopSimulation 
  } = useWebSocket()
  const [selectedStation, setSelectedStation] = useState("La Cisterna")

  const handleStationChange = (value: string) => setSelectedStation(value);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-center sm:justify-start space-x-2 sm:space-x-4">
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
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Seleccionar estación" />
              </SelectTrigger>
              <SelectContent>
                {STATIONS.map((station) => (
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
            className="h-[300px] sm:h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stationsData[selectedStation] || []} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="none" />
                <XAxis
                  dataKey="hour"
                  tickFormatter={(tickItem) => `${tickItem}:00`}
                  domain={[6, 23]}
                  type="number"
                  ticks={Array.from({ length: 18 }, (_, i) => i + 6)}
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
            className="h-[300px] sm:h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="hour"
                  tickFormatter={(tickItem) => `${tickItem}:00`}
                  domain={[6, 23]}
                  type="number"
                  ticks={Array.from({ length: 18 }, (_, i) => i + 6)}
                />
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