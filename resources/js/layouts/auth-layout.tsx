import AuthSimpleLayout from "./auth/auth-simple-layout";

interface AuthLayoutProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

export default function AuthLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <AuthSimpleLayout>
            <div className="max-w-md w-full space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                    {description && (
                        <p className="mt-2 text-sm text-gray-600">{description}</p>
                    )}
                </div>
                {children}
            </div>
        </AuthSimpleLayout>
    );
}
