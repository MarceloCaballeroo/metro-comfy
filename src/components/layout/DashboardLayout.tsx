"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useWebSocket } from "@/hooks/use-websocket"
import DashboardPage from "@/app/dashboard/page"
import RealtimePage from "@/app/realtime/page"
import AlertsPage from "@/app/alerts/page"
import HistoryPage from "@/app/history/page"
import SettingsPage from "@/app/settings/page"


interface DashboardLayoutProps {
  onLogout: () => void;
}

export default function DashboardLayout({ onLogout }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { alerts } = useWebSocket()

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">Metro Comfy</h1>
          <div className="flex flex-wrap justify-center sm:justify-end space-x-2 sm:space-x-4">
            <Button variant="ghost" onClick={() => setActiveTab("realtime")}>Tiempo Real</Button>
            <Button variant="ghost" onClick={() => setActiveTab("dashboard")}>Dashboard</Button>
            <Button variant="ghost" onClick={() => setActiveTab("alerts")} className="relative">
              Alertas
              {alerts.length > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {alerts.length}
                </span>
              )}
            </Button>
            <Button variant="ghost" onClick={() => setActiveTab("history")}>Historial</Button>
            <Button variant="ghost" onClick={() => setActiveTab("settings")}>Ajustes</Button>
            <Button variant="ghost" onClick={onLogout}>Cerrar Sesión</Button>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto p-4">
        <Card>
          <CardContent>
            {activeTab === "dashboard" && <DashboardPage />}
            {activeTab === "realtime" && <RealtimePage />}
            {activeTab === "alerts" && <AlertsPage />}
            {activeTab === "history" && <HistoryPage />}
            {activeTab === "settings" && <SettingsPage />}
          </CardContent>
        </Card>
      </main>

      <footer className="bg-primary text-primary-foreground p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Metro Comfy. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}