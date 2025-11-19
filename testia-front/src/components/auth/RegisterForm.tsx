import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2Icon } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

export function RegisterForm() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const loginStore = useAuthStore((s) => s.login);

  // If coming from InvitePage → email prefill
  const invitedEmail = params.get("email") || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState(invitedEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Prefill email if invitation
  useEffect(() => {
    if (invitedEmail) {
      setEmail(invitedEmail);
    }
  }, [invitedEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setIsLoading(true);

    try {
      // 1️⃣ Registrar usuario
      await api.post("/api/v1/auth/register", {
        fullName: name,
        email,
        password,
      });

      // 2️⃣ Auto-login
      const loginRes = await api.post("/api/v1/auth/login", {
        email,
        password,
      });

      const { token, id, role } = loginRes.data;

      // 3️⃣ Guardar sesión global
      loginStore(
        {
          id,
          email,
          role: role.toLowerCase(),
        },
        token
      );

      // 4️⃣ Redirigir según rol
      if (role === "ADMIN" || role === "RECRUITER") {
        navigate("/admin/dashboard");
      } else {
        navigate("/candidate/tests");
      }
    } catch (err: any) {
      const backendMsg =
        err.response?.data?.message || "No fue posible registrar la cuenta.";
      setError(backendMsg);
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
          <CardTitle className="text-2xl font-alt font-semibold text-foreground">
            Crear cuenta
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Regístrate para comenzar con TestIA
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Nombre completo
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-background text-foreground border-border"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={!!invitedEmail}   // <--- Bloquea si viene invitación
                className="bg-background text-foreground border-border"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Contraseña
              </Label>
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

            {/* Confirm password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">
                Confirmar contraseña
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-background text-foreground border-border"
              />
            </div>

            {/* Error */}
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
                  Registrando...
                </>
              ) : (
                "Crear cuenta"
              )}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <a href="/login" className="text-primary hover:underline">
                Inicia sesión
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
