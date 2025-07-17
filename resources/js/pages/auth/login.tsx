import React, { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PasswordInput from '@/components/PasswordInput';

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

            <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-background">

                <div className="flex items-center justify-center px-8 py-12 order-2 lg:order-1">
                    <div className="w-full max-w-md space-y-6">
                        <div className="text-left">
                            <h2 className="text-4xl font-bold">Selamat Datang Kembali</h2>
                            <p className="mt-4 text-muted-foreground text-lg">
                                Masukkan email dan password untuk masuk
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="email" className="text-lg">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full h-[50px]"
                                />
                                {errors.email && <p className="mt-2 text-sm text-destructive">{errors.email}</p>}
                            </div>
                            <div>
                                <Label htmlFor="password" className="text-lg">Password</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    error={errors.password}
                                    className="w-full h-[50px]"
                                />
                            </div>
                            <Button
                                variant="secondary"
                                type="submit"
                                className="w-full h-[55px] text-lg font-semibold"
                                disabled={processing}
                            >
                                {processing ? 'Memproses...' : 'Masuk'}
                            </Button>
                        </form>
                        <div className="text-center text-base">
                            Belum punya akun?{' '}
                            <Link href={route('register')} className="underline font-semibold">
                                Daftar di sini
                            </Link>
                        </div>
                        <footer className="text-center text-sm text-muted-foreground opacity-70">
                            © 2023 ALL RIGHTS RESERVED
                        </footer>
                    </div>
                </div>

                <div className="order-1 lg:order-2">
                    <img
                        src="/img/default-avatar.gif"
                        alt="Background"
                        className="w-full h-[250px] lg:h-full object-cover rounded-b-3xl lg:rounded-b-none lg:rounded-r-3xl"
                    />
                </div>
            </div>
        </>
    );
}