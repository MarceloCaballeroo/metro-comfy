"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWebSocket } from "@/hooks/use-websocket"

export default function AlertsPage() {
  const { alerts } = useWebSocket()

  const acknowledgeAlert = (id: string) => {
    // Implementar la lógica para reconocer la alerta
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between space-x-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="flex items-center space-x-2">
                  <Bell className="text-yellow-500" />
                  <p>{alert.message}</p>
                </div>
                {!alert.acknowledged && (
                  <Button onClick={() => acknowledgeAlert(alert.id)}>
                    Reconocer
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p>No hay alertas activas en este momento.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}