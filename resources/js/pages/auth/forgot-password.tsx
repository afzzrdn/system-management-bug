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
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white">
                <div className="flex items-center justify-center p-8 ">
                    <div className="w-full max-w-sm mx-auto">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Lupa Password</h2>
                            <p className="text-gray-500 mt-2 text-sm">Masukkan email atau nomor WhatsApp. Kode OTP akan dikirim ke WhatsApp Anda.</p>
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
                                    className="h-10 mt-1"
                                />
                                {errors.identifier && <p className="text-red-500 mt-2 text-sm">{errors.identifier}</p>}
                            </div>
                            <button type="submit" className="h-10 w-full text-white bg-blue-500 rounded-xl font-semibold" disabled={processing}>
                                {processing ? 'Mengirim...' : 'Kirim Kode OTP'}
                            </button>
                        </form>
                        <div className="mt-6 text-center text-sm">
                            <span className="text-gray-500">Sudah ingat password? </span>
                            <Link href={route('login')} className="font-semibold text-blue-500">
                                Kembali ke Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
