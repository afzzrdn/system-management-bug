import React, { useState, ChangeEvent, FormEvent } from 'react';
import { router } from '@inertiajs/react';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState<string | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrors(null);

        router.post('/login', form, {
            onError: (err) => setErrors(err.email || 'Login gagal'),
            onSuccess: () => router.visit('/dashboard'),
        });
    };

    return (
        <div className='bg-white border-2'>
            <h2>Login</h2>
            {errors && <div style={{ color: 'red' }}>{errors}</div>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Login</button>
                <p>Belum punya akun? <span><a href="/register" className='text-blue-500'>Buat akun</a></span></p>
            </form>
        </div>
    );
}
