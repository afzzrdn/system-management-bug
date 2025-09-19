import PasswordInput from '@/components/PasswordInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Log in" />
            <div className="min-h-screen w-full flex flex-col lg:grid lg:grid-cols-2">
                <div className="relative h-64 lg:h-full order-1 lg:order-2 ">
                    <img
                        src="/img/background-gambar.gif"
                        alt="Abstract art representing data and bugs"
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={(e) => e.currentTarget.src = 'https://placehold.co/1080x1920/111827/ffffff?text=Image+Error'}
                    />
                    <div className="relative z-10 flex flex-col justify-end h-full bg-black/25 p-10 text-white">
                        <h1 className="text-5xl font-bold">BugReport</h1>
                    </div>
                </div>
                <div className="flex items-center justify-center p-8 bg-white order-2 lg:order-1">
                    <div className="w-full max-w-sm mx-auto">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Selamat datang kembali!</h2>
                            <p className="text-gray-500 mt-2">Masukkan  Email dan Password yang sudah terdaftar!</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="email@example.com"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="h-12 mt-1"
                                />
                                {errors.email && <p className="text-red-500 mt-2 text-sm">{errors.email}</p>}
                            </div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    error={errors.password}
                                    className="h-12 mt-1"
                                />
                            </div>
                            <div className="text-right">
                                <Link href={route('password.request')} className="text-sm text-indigo-600 hover:underline">
                                    Lupa Password?
                                </Link>
                            </div>
                            <Button variant="secondary" type="submit" className="h-12 w-full text-base font-semibold" disabled={processing}>
                                {processing ? 'Processing...' : 'Sign In'}
                            </Button>
                        </form>
                        <div className="mt-6 text-center text-sm">
                            <span className="text-gray-500">Tidak punya akun? </span>
                            <Link href={route('register')} className="font-semibold text-indigo-600 hover:underline">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
