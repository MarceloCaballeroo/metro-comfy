"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWebSocket } from "@/hooks/use-websocket"

export default function RealtimePage() {
  const { globalCount, stationsData } = useWebSocket()

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </div>
  )
}