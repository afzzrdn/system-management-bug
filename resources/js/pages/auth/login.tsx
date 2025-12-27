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
            <div className="min-h-screen w-full bg-white flex flex-col justify-center items-center">
                <div className="flex items-center justify-center p-8 order-2 lg:order-1">
                    <div className="w-full max-w-sm mx-auto">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Selamat datang kembali!</h2>
                            <p className="text-gray-500 mt-2 text-sm">Masukkan  Email dan Password yang sudah terdaftar!</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Masukkan Email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="h-10 mt-1 focus:outline-none"
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
                                    className="h-10 mt-1 focus:outline-none"
                                />
                            </div>
                            <div className="text-right">
                                <Link href={route('password.request')} className="text-sm text-blue-500 hover:underline">
                                    Lupa Password?
                                </Link>
                            </div>
                            <button type="submit" className="h-10 w-full cursor-pointer bg-blue-500 rounded-xl text-white font-semibold" disabled={processing}>
                                {processing ? 'Memuat...' : 'Masuk'}
                            </button>
                        </form>
                        <div className="mt-6 text-center text-sm">
                            <span className="text-gray-500">Tidak punya akun? </span>
                            <Link href={route('register')} className="font-semibold text-blue-500">
                                Buat Akun
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
