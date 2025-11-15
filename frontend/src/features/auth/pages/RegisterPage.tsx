import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import AuthLayout from '@/shared/components/layout/AuthLayout';
import Input from '@/shared/components/ui/Input/Input';
import Select from '@/shared/components/ui/Select/Select';
import Button from '@/shared/components/ui/Button/Button';
import ErrorMessage from '@/shared/components/feedback/ErrorMessage';
import {useAuth} from '../hooks/useAuth';
import {ROUTES} from '@/shared/utils/constants';
import {emailSchema, passwordSchema, nameSchema} from '@/shared/utils/validation';

const registerSchema = z.object({
    firstName: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    role: z.enum(['EVALUATOR', 'CANDIDATE'] as const),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const {register: registerUser, isLoading, error, clearError} = useAuth();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: 'CANDIDATE',
        },
    });

    const onSubmit = async (data: RegisterFormData) => {
        setServerError(null);
        clearError();

        try {
            await registerUser(data);
            // Navigation is handled by AppRouter
        } catch (error: any) {
            setServerError(error.message || 'Failed to register. Please try again.');
        }
    };

    return (
        <AuthLayout>
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create an account</h2>
                <p className="text-gray-600 mb-6">Get started with TechEval today</p>

                {(serverError || error) && (
                    <ErrorMessage message={serverError || error || ''} className="mb-4"/>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Full Name"
                        type="text"
                        placeholder="John Doe"
                        error={errors.firstName?.message}
                        fullWidth
                        {...register('firstName')}
                    />

                    <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        error={errors.email?.message}
                        fullWidth
                        {...register('email')}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        error={errors.password?.message}
                        helperText="At least 8 characters with uppercase, lowercase, and number"
                        fullWidth
                        {...register('password')}
                    />

                    <Select
                        label="I am a"
                        options={[
                            {value: 'CANDIDATE', label: 'Candidate - Take technical tests'},
                            {value: 'EVALUATOR', label: 'Evaluator - Create and manage tests'},
                        ]}
                        error={errors.role?.message}
                        fullWidth
                        {...register('role')}
                    />

                    <Button
                        type="submit"
                        loading={isLoading}
                        disabled={isLoading}
                        fullWidth
                        size="lg"
                    >
                        Create accounting
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link
                            to={ROUTES.LOGIN}
                            className="font-medium text-primary-600 hover:text-primary-700"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
