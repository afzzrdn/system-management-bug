interface AuthSimpleLayoutProps {
    children: React.ReactNode;
}

export default function AuthSimpleLayout({ children }: AuthSimpleLayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
                    {children}
                </div>
            </div>
        </div>
    );
}
