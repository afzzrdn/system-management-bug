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

            <div className="dark:bg-background grid min-h-screen w-full grid-cols-1 bg-white lg:grid-cols-2">
                <div className="order-2 flex items-center justify-center px-8 py-12 lg:order-1">
                    <div className="w-full max-w-md space-y-6">
                        <div className="text-left">
                            <h2 className="text-3xl font-bold">Halo,</h2>
                            <h2 className="text-3xl font-bold">Selamat Datang Kembali</h2>
                            <p className="text-muted-foreground mt-4">Masukkan email dan password untuk masuk</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="email" className="text-lg">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="h-[50px] w-full"
                                />
                                {errors.email && <p className="text-destructive mt-2 text-sm">{errors.email}</p>}
                            </div>
                            <div>
                                <Label htmlFor="password" className="text-lg">
                                    Password
                                </Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    error={errors.password}
                                    className="h-[50px] w-full"
                                />
                            </div>
                            <Button variant="secondary" type="submit" className="h-[55px] w-full text-lg font-semibold" disabled={processing}>
                                {processing ? 'Memproses...' : 'Masuk'}
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="flex flex-col gap-5 items-center justify-center bg-indigo-600 text-center text-2xl text-white">
                    <p>Belum punya akun?</p>
                    <Link href={route('register')} className="font-semibold border-2 bg-white text-indigo-600 border-white rounded-xl py-5 px-7">
                        Daftar di sini
                    </Link>
                </div>
            </div>
        </>
    );
}
