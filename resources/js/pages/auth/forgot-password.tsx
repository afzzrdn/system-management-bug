import React, { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPassword() {
    const { data, setData, post, processing, errors } = useForm({
        identifier: '', // bisa email atau nomor phone
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('password.request'));
    };

    return (
        <>
            <Head title="Lupa Password" />
            <div className="min-h-screen w-full flex flex-col lg:grid lg:grid-cols-2">
                <div className="flex items-center justify-center p-8 bg-white order-2 lg:order-1">
                    <div className="w-full max-w-sm mx-auto">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Lupa Password</h2>
                            <p className="text-gray-500 mt-2">Masukkan email atau nomor WhatsApp. Kode OTP akan dikirim ke WhatsApp Anda.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="identifier">Email atau Nomor WhatsApp</Label>
                                <Input
                                    id="identifier"
                                    type="text"
                                    placeholder="email@example.com atau 628xxxxxxxxxx"
                                    required
                                    value={data.identifier}
                                    onChange={(e) => setData('identifier', e.target.value)}
                                    className="h-12 mt-1"
                                />
                                {errors.identifier && <p className="text-red-500 mt-2 text-sm">{errors.identifier}</p>}
                            </div>
                            <Button variant="secondary" type="submit" className="h-12 w-full text-base font-semibold" disabled={processing}>
                                {processing ? 'Mengirim...' : 'Kirim Kode OTP'}
                            </Button>
                        </form>
                        <div className="mt-6 text-center text-sm">
                            <span className="text-gray-500">Sudah ingat password? </span>
                            <Link href={route('login')} className="font-semibold text-indigo-600 hover:underline">
                                Kembali ke Login
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="relative h-64 lg:h-full">
                    <img
                        src="/img/background-gambar.gif"
                        alt="Abstract art representing data and bugs"
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={(e) => e.currentTarget.src = 'https://placehold.co/1080x1920/111827/ffffff?text=Image+Error'}
                    />
                    <div className="relative z-10 flex flex-col justify-end h-full bg-black/25 p-10 text-white">
                        <h1 className="text-5xl font-bold">BugReport</h1>
                        <p className="mt-4 text-xl">Reset your password securely</p>
                    </div>
                </div>
            </div>
        </>
    );
}
