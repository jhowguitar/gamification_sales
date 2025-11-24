export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-violet-900 to-purple-800">
            <div className="w-full max-w-md">
                {children}
            </div>
        </div>
    );
}
