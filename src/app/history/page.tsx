"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"

export default function HistoryPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
          {selectedDate && (
            <Card className="w-full">
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
  )
}