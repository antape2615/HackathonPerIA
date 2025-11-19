import { RegisterForm } from '../components/auth/RegisterForm';

export function RegisterPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://c.animaapp.com/mhtwxrzzH7EDRa/img/ai_1.png')`,
      }}
    >
      <RegisterForm />
    </div>
  );
}
