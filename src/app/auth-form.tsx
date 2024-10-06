'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { registerUser, loginUser } from "@/lib/auth"

interface AuthFormProps {
    onAuthSuccess: () => void;
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, action: 'register' | 'login') => {
        event.preventDefault()
        setIsLoading(true)
        setError('')

        const formData = new FormData(event.currentTarget)
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            if (action === 'register') {
                await registerUser(email, password);
                onAuthSuccess(); // Llama a la función de éxito después del registro
            } else {
                await loginUser(email, password);
                onAuthSuccess(); // Llama a la función de éxito después del inicio de sesión
            }
        } catch (error) {
            console.error("Error durante la autenticación:", error);
            setError('Ocurrió un error. Por favor, intenta de nuevo.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Acceso Metro Comfy</CardTitle>
                <CardDescription>Ingresa o regístrate para continuar.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                        <TabsTrigger value="register">Registrarse</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <form onSubmit={(e) => handleSubmit(e, 'login')}>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input id="email" name="email" type="email" required />
                            </div>
                            <div className="grid gap-2 mt-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input id="password" name="password" type="password" required />
                            </div>
                            <Button className="w-full mt-4" type="submit" disabled={isLoading}>
                                {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
                            </Button>
                        </form>
                    </TabsContent>
                    <TabsContent value="register">
                        <form onSubmit={(e) => handleSubmit(e, 'register')}>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input id="name" name="name" required />
                            </div>
                            <div className="grid gap-2 mt-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input id="email" name="email" type="email" required />
                            </div>
                            <div className="grid gap-2 mt-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input id="password" name="password" type="password" required />
                            </div>
                            <Button className="w-full mt-4" type="submit" disabled={isLoading}>
                                {isLoading ? 'Cargando...' : 'Registrarse'}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </CardContent>
            <CardFooter>
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </CardFooter>
        </Card>
    )
}