import React, { useState, ChangeEvent, FormEvent } from 'react';
import { router } from '@inertiajs/react';

interface ValidationErrors {
    name?: string;
    email?: string;
    password?: string;
}

export default function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    const [errors, setErrors] = useState<ValidationErrors>({});

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrors({}); 

        router.post('/register', form, {
            onError: (err: ValidationErrors) => {
                setErrors(err);
            },
            onSuccess: () => {
                alert('Registrasi berhasil! Silakan login.');
                router.visit('/login');
            },
        });
    };

    return (
        <div className='bg-white border-2 p-8 rounded-lg shadow-md w-full max-w-md'>
            <h2 className='text-2xl font-bold mb-6 text-center'>Register</h2>

            <form onSubmit={handleSubmit}>
                <div className='mb-4'>
                    <label className='block text-gray-700 mb-2'>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className='w-full px-3 py-2 border rounded-lg'
                        required
                    />
                    {errors.name && <div className='text-red-500 text-sm mt-1'>{errors.name}</div>}
                </div>

                <div className='mb-4'>
                    <label className='block text-gray-700 mb-2'>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className='w-full px-3 py-2 border rounded-lg'
                        required
                    />
                    {errors.email && <div className='text-red-500 text-sm mt-1'>{errors.email}</div>}
                </div>

                <div className='mb-4'>
                    <label className='block text-gray-700 mb-2'>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className='w-full px-3 py-2 border rounded-lg'
                        required
                    />
                    {errors.password && <div className='text-red-500 text-sm mt-1'>{errors.password}</div>}
                </div>

                <div className='mb-6'>
                    <label className='block text-gray-700 mb-2'>Confirm Password</label>
                    <input
                        type="password"
                        name="password_confirmation"
                        value={form.password_confirmation}
                        onChange={handleChange}
                        className='w-full px-3 py-2 border rounded-lg'
                        required
                    />
                </div>

                <button
                    type="submit"
                    className='w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors'
                >
                    Register
                </button>
            </form>
        </div>
    );
}