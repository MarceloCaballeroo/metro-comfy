"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()

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
        </div>
      </CardContent>
    </Card>
  )
}