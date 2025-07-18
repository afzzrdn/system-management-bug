import { EyeClosed, Eye } from 'lucide-react';
import React, { useState } from 'react';


interface PasswordInputProps {
    id?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    className?: string;
    error?: string;
}

export default function PasswordInput({
    id = 'password',
    value,
    onChange,
    required = false,
    className = '',
    error,
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    const baseClasses = "appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
    const errorClasses = "border-red-500 focus:ring-red-500 focus:border-red-500";

    return (
        <div>
            <div className="relative">
                <input
                    id={id}
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={`${baseClasses} pr-10 ${error ? errorClasses : ''} ${className}`}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500" // Pindahkan styling ke komponen ikon
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >

                    {showPassword ? (
                        <Eye  className="w-5 h-5"/>
                    ) : (
                        <EyeClosed className="w-5 h-5" />
                    )}
                </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    );
}
