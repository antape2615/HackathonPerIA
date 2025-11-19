import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export function InvitePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const email = params.get("email");

  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState<boolean | null>(null);

  useEffect(() => {
    const validate = async () => {
      if (!email) return;

      try {
        const res = await api.get(`/api/v1/auth/check-email?email=${email}`);
        setExists(res.data.exists);
      } catch {
        setExists(false);
      } finally {
        setLoading(false);
      }
    };

    validate();
  }, [email]);

  if (!email) {
    return (
      <div className="h-screen flex items-center justify-center text-destructive">
        Enlace inválido.
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://c.animaapp.com/mhtwxrzzH7EDRa/img/ai_1.png')",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full max-w-md bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-alt">Has sido invitado</CardTitle>

            <CardDescription className="text-muted-foreground">
              {
                exists === true
                  ? (
                    <>
                      Ya existe una cuenta vinculada al correo:
                      <br />
                      <b className="text-foreground">{email}</b>
                      <br />
                      Por favor inicia sesión para ver tus pruebas asignadas.
                    </>
                  )
                  : exists === false
                  ? (
                    <>
                      Te han invitado a completar una prueba técnica.
                      <br />
                      Completa tu registro con el correo:
                      <br />
                      <b className="text-foreground">{email}</b>
                    </>
                  )
                  : "Validando invitación..."
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              Después de iniciar sesión o registrarte podrás acceder a tus pruebas asignadas.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            {loading ? (
              <p className="text-center text-muted-foreground">Validando email...</p>
            ) : exists === true ? (
              <Button className="w-full" onClick={() => navigate(`/login?email=${email}`)}>
                Iniciar sesión
              </Button>
            ) : (
              <Button className="w-full" onClick={() => navigate(`/register?email=${email}`)}>
                Crear cuenta
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
