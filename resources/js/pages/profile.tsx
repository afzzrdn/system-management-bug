import React, { useState, FormEvent } from 'react';
import { usePage, Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { User } from '../layouts/app-layout';
import FlashMessage from '../components/FlashMessage';
import AppLayout from '../layouts/app-layout';

interface Flash {
    message?: string;
    type?: 'success' | 'error';
}

const Profile = () => {
    const { auth, flash } = usePage<{ auth: { user: User }, flash?: Flash }>().props;
    const user = auth?.user;

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        asal: user?.asal || '',
    });

    const [passwordData, setPasswordData] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [flashMessage, setFlashMessage] = useState<Flash | null>(flash && flash.message ? flash : null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileSubmit = (e: FormEvent) => {
        e.preventDefault();

        router.put('/profile', {
            name: profileData.name,
            email: profileData.email,
            phone: profileData.phone,
            asal: profileData.asal,
        }, {
            onSuccess: () => {
                setFlashMessage({ message: 'Profile updated successfully', type: 'success' });
                setErrors({});
            },
            onError: (errors) => {
                setErrors(errors as Record<string, string>);
            },
        });
    };

    const handlePasswordSubmit = (e: FormEvent) => {
        e.preventDefault();
        router.put('/profile/password', passwordData, {
        onSuccess: () => {
            setFlashMessage({ message: 'Password updated successfully', type: 'success' });
            setPasswordData({
            current_password: '',
            password: '',
            password_confirmation: '',
            });
            setErrors({});
        },
        onError: (errors) => {
            setErrors(errors);
        },
        });
    };

    return (
        <AppLayout>
        <Head title="Profile" />
        <div className="container mx-auto py-8">
            <div className="max-w-8xl mx-auto px-8 sm:px-6 lg:px-8">
            {flashMessage && (
                <FlashMessage
                message={flashMessage.message || ''}
                type={flashMessage.type || 'success'}
                onClose={() => setFlashMessage(null)}
                />
            )}

            <div className="bg-white overflow-hidden shadow-xl sm:rounded-2xl border border-gray-100">
                <div className="p-8 bg-white border-b border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Manage your account information and security settings.
                            </p>
                        </div>
                    </div>

                <form onSubmit={handleProfileSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={profileData.name}
                                onChange={handleProfileChange}
                                className="w-full h-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={profileData.email}
                                onChange={handleProfileChange}
                                className="w-full h-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="text"
                                value={profileData.phone}
                                onChange={handleProfileChange}
                                className="w-full h-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                            />
                            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                        </div>

                        <div>
                            <label htmlFor="asal" className="block text-sm font-medium text-gray-700 mb-1">
                                Asal
                            </label>
                            <input
                                id="asal"
                                name="asal"
                                type="text"
                                value={profileData.asal}
                                onChange={handleProfileChange}
                                className="w-full h-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                            />
                            {errors.asal && <p className="mt-1 text-sm text-red-600">{errors.asal}</p>}
                        </div>
                    </div>

                    <div className="flex pt-4 border-t border-gray-100">
                        <button
                            type="submit"
                            className="inline-flex items-center px-6 py-3 bg-indigo-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150 shadow-sm"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
                </div>
            </div>

            <div className="mt-4  bg-white overflow-hidden shadow-xl sm:rounded-2xl border border-gray-100">
                <div className="p-8 items bg-white border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Update Password</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Ensure your account is using a long, random password to stay secure.
                    </p>

                <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-2xl">
                    <div>
                    <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                    </label>
                    <input
                        id="current_password"
                        name="current_password"
                        type="password"
                        value={passwordData.current_password}
                        onChange={handlePasswordChange}
                        className="w-full h-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                    />
                    {errors.current_password && (
                        <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>
                    )}
                    </div>

                    <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={passwordData.password}
                        onChange={handlePasswordChange}
                        className="w-full h-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                    </div>

                    <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                    </label>
                    <input
                        id="password_confirmation"
                        name="password_confirmation"
                        type="password"
                        value={passwordData.password_confirmation}
                        onChange={handlePasswordChange}
                        className="w-full h-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                    />
                    {errors.password_confirmation && (
                        <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                    )}
                    </div>

                    <div className="flex pt-4 border-t border-gray-100">
                    <button
                        type="submit"
                        className="inline-flex items-center px-6 py-3 bg-gray-800 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150 shadow-sm"
                    >
                        Update Password
                    </button>
                    </div>
                </form>
                </div>
            </div>
            </div>
        </div>
        </AppLayout>
    );
    };

    export default Profile;
