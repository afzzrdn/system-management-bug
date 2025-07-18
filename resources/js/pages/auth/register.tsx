import React, { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PasswordInput from '@/components/PasswordInput';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('register'), {
            onSuccess: () => alert('Pendaftaran berhasil! Silakan login.'),
        });
    };

    return (
        <>
            <Head title="Register" />

            <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-background">

                <div className="order-1 lg:order-none">
                    <img
                        src="/img/default-avatar.gif"
                        alt="Background"
                        className="w-full h-[250px] lg:h-full object-cover rounded-b-3xl lg:rounded-b-none lg:rounded-l-3xl scale-x-[-1]"
                    />
                </div>

                <div className="flex items-center justify-center px-6 py-8 order-2">
                    <div className="w-full max-w-md space-y-6">
                        <div className="text-left">
                            <h2 className="text-4xl font-bold">Buat Akun Baru</h2>
                            <p className="mt-3 text-muted-foreground text-2xl">
                                Masukkan informasi Anda untuk membuat akun
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="name" className="text-lg">Nama</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Max Robinson"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full h-[50px]"
                                />
                                {errors.name && <p className="mt-2 text-sm text-destructive">{errors.name}</p>}
                            </div>
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
                            <div>
                                <Label htmlFor="password_confirmation" className="text-lg">Konfirmasi Password</Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="w-full h-[50px]"
                                />
                            </div>
                            <Button
                                variant="secondary"
                                type="submit"
                                className="w-full h-[55px] text-base font-semibold"
                                disabled={processing}
                            >
                                {processing ? 'Membuat Akun...' : 'Buat Akun'}
                            </Button>
                        </form>
                        <div className="text-center text-lg">
                            Sudah punya akun?{' '}
                            <Link href={route('login')} className="underline font-medium">
                                Masuk
                            </Link>
                        </div>
                        <footer className="text-center text-sm text-muted-foreground opacity-70 pt-8">
                            © 2023 ALL RIGHTS RESERVED
                        </footer>
                    </div>
                </div>

            </div>
        </>
    );
}
