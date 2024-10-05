"use client"

import { useState } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data generation function
const generateMockData = (baseValue: number) => {
  return Array.from({ length: 18 }, (_, i) => {
    const hour = i + 6
    const passengers = Math.floor(baseValue + Math.random() * 100000 * Math.sin((hour - 6) / 17 * Math.PI))
    return { hour: `${hour.toString().padStart(2, '0')}:00`, passengers }
  })
}

const stations = ["La Cisterna", "San Ramon", "Santa Rosa", "La Granja", "Santa Julia", "Vicuña Mackenna"]
const lineData = generateMockData(150000)

export default function Component() {
  const [selectedStation, setSelectedStation] = useState(stations[0])
  const [stationData, setStationData] = useState(generateMockData(100000))

  const handleStationChange = (value: string) => {
    setSelectedStation(value)
    setStationData(generateMockData(100000)) // Regenerate data for new station
  }

  return (
    <div className="space-y-8 p-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Trafico por estacion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select onValueChange={handleStationChange} value={selectedStation}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select station" />
              </SelectTrigger>
              <SelectContent>
                {stations.map((station) => (
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
                label: "Passengers",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis domain={[10000, 300000]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="passengers" stroke="var(--color-passengers)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Trafico general de la lista</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              passengers: {
                label: "Passengers",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis domain={[10000, 300000]} />
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