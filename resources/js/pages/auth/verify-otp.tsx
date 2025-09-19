import React, { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VerifyOTPProps {
    identifier: string;
}

export default function VerifyOTP({ identifier }: VerifyOTPProps) {
    const { data, setData, post, processing, errors } = useForm({
        otp: '',
        identifier: identifier,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('password.verify-otp'));
    };

    return (
        <>
            <Head title="Verifikasi OTP" />
            <div className="min-h-screen w-full flex flex-col lg:grid lg:grid-cols-2">
                <div className="flex items-center justify-center p-8 bg-white order-2 lg:order-1">
                    <div className="w-full max-w-sm mx-auto">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Verifikasi OTP</h2>
                            <p className="text-gray-500 mt-2">
                                Kode OTP telah dikirim ke WhatsApp Anda
                                {identifier.includes('@') ? ' (berdasarkan nomor HP yang terdaftar di akun)' : ''}
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="otp">Kode OTP</Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="Masukkan 6 digit kode OTP"
                                    required
                                    maxLength={6}
                                    value={data.otp}
                                    onChange={(e) => setData('otp', e.target.value.replace(/\D/g, ''))}
                                    className="h-12 mt-1 text-center text-lg tracking-widest"
                                />
                                {errors.otp && <p className="text-red-500 mt-2 text-sm">{errors.otp}</p>}
                            </div>
                            <Button variant="secondary" type="submit" className="h-12 w-full text-base font-semibold" disabled={processing}>
                                {processing ? 'Memverifikasi...' : 'Verifikasi OTP'}
                            </Button>
                        </form>
                        <div className="mt-6 space-y-2 text-center text-sm">
                            <div>
                                <span className="text-gray-500">Tidak menerima kode? </span>
                                <Link href={route('password.request')} className="font-semibold text-indigo-600 hover:underline">
                                    Kirim Ulang
                                </Link>
                            </div>
                            <div>
                                <Link href={route('login')} className="font-semibold text-indigo-600 hover:underline">
                                    Kembali ke Login
                                </Link>
                            </div>
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
                        <p className="mt-4 text-xl">Verifikasi identitas Anda</p>
                    </div>
                </div>
            </div>
        </>
    );
}
