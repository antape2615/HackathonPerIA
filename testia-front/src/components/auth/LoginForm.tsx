import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { Loader2Icon } from 'lucide-react';
import api from "@/lib/api";

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.post('/api/v1/auth/login', {
        email,
        password,
      });

      const { token, id, role } = res.data;

      // Guardar en Zustand
      login(
        {
          id,
          email,
          role: role.toLowerCase(), // "admin" | "recruiter" | "candidate"
        },
        token
      );
      console.log('Usuario logueado:', { id, email, role });
      // Redirecciones
      if (role === "ADMIN") navigate('/admin/dashboard');
      else if (role === "RECRUITER") navigate('/admin/dashboard');
      else navigate('/candidate/tests');

    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-md bg-card text-card-foreground border-border">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-alt font-semibold text-foreground">Iniciar sesión</CardTitle>
          <CardDescription className="text-muted-foreground">
            Ingresa tus credenciales para acceder a TestIA
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background text-foreground border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background text-foreground border-border"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <a href="/register" className="text-primary hover:underline">
                Regístrate
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
