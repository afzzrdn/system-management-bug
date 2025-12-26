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
        phone: '',
        asal: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <>
            <Head title="Register" />
            <div className="min-h-screen w-full flex flex-col justify-center items-center bg-white">
                <div className="flex items-center justify-center p-8 bg-white order-2 lg:order-1">
                    <div className="w-200 mx-auto">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Buat Akun</h2>
                            <p className="text-gray-500 mt-2">Masukkan informasi untuk memulai</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-2 space-x-5">
                            <div>
                                <Label htmlFor="name">Nama</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Your Name"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="h-10 mt-1"
                                />
                                {errors.name && <p className="text-red-500 mt-2 text-sm">{errors.name}</p>}
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="email@example.com"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="h-10 mt-1"
                                />
                                {errors.email && <p className="text-red-500 mt-2 text-sm">{errors.email}</p>}
                            </div>
                            <div>
                                <Label htmlFor="phone">Nomor WhatsApp</Label>
                                <Input
                                    id="phone"
                                    type="text"
                                    placeholder="628xxxxxxxxxx"
                                    required
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="h-10 mt-1"
                                />
                                {errors.phone && <p className="text-red-500 mt-2 text-sm">{errors.phone}</p>}
                            </div>
                            <div>
                                <Label htmlFor="asal">Asal Daerah</Label>
                                <Input
                                    id="asal"
                                    type="text"
                                    placeholder="Contoh: Jakarta, Bandung, dll"
                                    required
                                    value={data.asal}
                                    onChange={(e) => setData('asal', e.target.value)}
                                    className="h-10 mt-1"
                                />
                                {errors.asal && <p className="text-red-500 mt-2 text-sm">{errors.asal}</p>}
                            </div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    error={errors.password}
                                    className="h-10 mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="h-10 mt-1"
                                />
                            </div>
                            <button type="submit" className="h-10 w-full mt-5 cursor-pointer text-white bg-blue-500 rounded-xl font-semibold" disabled={processing}>
                                {processing ? 'Membuat Akun...' : 'Buat Akun'}
                            </button>
                        </form>
                        <div className="mt-6 text-center text-sm">
                            <span className="text-gray-500">Sudah punya akun? </span>
                            <Link href={route('login')} className="font-semibold text-blue-500">
                                Masuk
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
