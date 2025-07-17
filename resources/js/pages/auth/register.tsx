import React, { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AuthSimpleLayout from '@/layouts/auth/auth-simple-layout';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('register'), {
            onSuccess: () => alert('Registration successful! Please log in.'),
        });
    };

    return (
        <AuthSimpleLayout>
            <Head title="Register" />
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Sign Up</CardTitle>
                    <CardDescription>
                        Enter your information to create an account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="Max Robinson" required value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" required value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required value={data.password} onChange={(e) => setData('password', e.target.value)} />
                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirm Password</Label>
                            <Input id="password_confirmation" type="password" required value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                        </div>
                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing ? "Creating Account..." : "Create an account"}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{' '}
                        <Link href={route('login')} className="underline">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </AuthSimpleLayout>
    );
}
