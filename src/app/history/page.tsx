"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Datos de ejemplo
const stationData = [
  { name: 'Estación A', alertas: 3, pasajeros: 15000 },
  { name: 'Estación B', alertas: 1, pasajeros: 12000 },
  { name: 'Estación C', alertas: 2, pasajeros: 18000 },
  { name: 'Estación D', alertas: 0, pasajeros: 10000 },
]

const hourlyData = [
  { hora: '00:00', pasajeros: 500 },
  { hora: '04:00', pasajeros: 1000 },
  { hora: '08:00', pasajeros: 5000 },
  { hora: '12:00', pasajeros: 4000 },
  { hora: '16:00', pasajeros: 6000 },
  { hora: '20:00', pasajeros: 3000 },
]

export default function HistoryPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Historial de Metro</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Seleccionar Fecha</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        {selectedDate && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Datos para {selectedDate.toLocaleDateString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="general">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="estaciones">Estaciones</TabsTrigger>
                  <TabsTrigger value="horas">Por Hora</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Pasajeros Totales</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-4xl font-bold">{Math.floor(Math.random() * 1000000).toLocaleString()}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Alertas Totales</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-4xl font-bold">{Math.floor(Math.random() * 10)}</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="estaciones">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="alertas" fill="#8884d8" name="Alertas" />
                      <Bar yAxisId="right" dataKey="pasajeros" fill="#82ca9d" name="Pasajeros" />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
                <TabsContent value="horas">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hora" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="pasajeros" fill="#8884d8" name="Pasajeros por Hora" />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}