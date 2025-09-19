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
        router.put('/profile', profileData, {
        onSuccess: () => {
            setFlashMessage({ message: 'Profile updated successfully', type: 'success' });
            setErrors({});
        },
        onError: (errors) => {
            setErrors(errors);
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
        <div className="container mx-auto">
            <div className="max-w-8xl mx-auto sm:px-6 lg:px-8">
            {flashMessage && (
                <FlashMessage
                message={flashMessage.message || ''}
                type={flashMessage.type || 'success'}
                onClose={() => setFlashMessage(null)}
                />
            )}

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-8 mt-2 bg-white border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information.
                </p>

                <form onSubmit={handleProfileSubmit} className="mt-6 space-y-6">
                    <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        className="mt-1 p-2.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                    />
                    {errors.name && (
                        <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                    )}
                    </div>

                    <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="mt-1 p-2.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                    />
                    {errors.email && (
                        <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                    )}
                    </div>

                    <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone
                    </label>
                    <input
                        id="phone"
                        name="phone"
                        type="text"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className="mt-1 p-2.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {errors.phone && (
                        <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                    )}
                    </div>

                    <div>
                    <label htmlFor="asal" className="block text-sm font-medium text-gray-700">
                        Asal Daerah
                    </label>
                    <input
                        id="asal"
                        name="asal"
                        type="text"
                        value={profileData.asal}
                        onChange={handleProfileChange}
                        className="mt-1 p-2.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Contoh: Jakarta, Bandung, dll"
                        required
                    />
                    {errors.asal && (
                        <p className="mt-2 text-sm text-red-600">{errors.asal}</p>
                    )}
                    </div>

                    <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        Save
                    </button>
                    </div>
                </form>
                </div>
            </div>

            <div className="mt-8 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 bg-white border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Update Password</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Ensure your account is using a long, random password to stay secure.
                </p>

                <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-6">
                    <div>
                    <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
                        Current Password
                    </label>
                    <input
                        id="current_password"
                        name="current_password"
                        type="password"
                        value={passwordData.current_password}
                        onChange={handlePasswordChange}
                        className="mt-3 p-2.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                    />
                    {errors.current_password && (
                        <p className="mt-2 text-sm text-red-600">{errors.current_password}</p>
                    )}
                    </div>

                    <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        New Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={passwordData.password}
                        onChange={handlePasswordChange}
                        className="mt-3 p-2.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                    />
                    {errors.password && (
                        <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                    )}
                    </div>

                    <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <input
                        id="password_confirmation"
                        name="password_confirmation"
                        type="password"
                        value={passwordData.password_confirmation}
                        onChange={handlePasswordChange}
                        className="mt-1 p-2.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                    />
                    </div>

                    <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        Save
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
