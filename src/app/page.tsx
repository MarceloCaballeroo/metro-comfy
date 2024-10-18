"use client"

import { useState } from "react"
import AuthForm from "@/components/AuthForm"
import DashboardLayout from "@/components/layout/DashboardLayout"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleAuthSuccess = () => setIsAuthenticated(true)
  const handleLogout = () => setIsAuthenticated(false)

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      </div>
    )
  }

  return <DashboardLayout onLogout={handleLogout} />
}