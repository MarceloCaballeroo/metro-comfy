"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
// ... importar hooks de WebSocket si es necesario
import { useWebSocket } from "@/hooks/use-websocket"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { handleStartSimulation, handleStopSimulation, isSimulationRunning } = useWebSocket(); // ... agregar el uso del WebSocket

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  return (
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
            <span>Cerrar Sesión</span>
            <Button variant="outline">
              Logout
            </Button>
          </div>
          {/* Botones de simulación */}
          <div className="flex items-center justify-between">
            <span>Simulación</span>
            <div>
              <Button onClick={handleStartSimulation} disabled={isSimulationRunning}>
                Iniciar Simulación
              </Button>
              <Button onClick={handleStopSimulation} disabled={!isSimulationRunning}>
                Detener Simulación
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}