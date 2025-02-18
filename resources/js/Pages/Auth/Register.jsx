import React from 'react';
import { useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

const Register = () => {
    const { data, setData, post, processing, errors } = useForm({
        login_identifier: '',
        password: '',
        password_confirmation: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <GuestLayout title="Register">
            <div className="max-w-md mx-auto mt-10">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label>Email or Phone</label>
                        <input
                            type="text"
                            value={data.login_identifier}
                            onChange={(e) => setData('login_identifier', e.target.value)}
                            placeholder="Email or Phone"
                            className="w-full border rounded p-2"
                        />
                        {errors.login_identifier && (
                            <p className="text-red-500">{errors.login_identifier}</p>
                        )}
                    </div>

                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                            className="w-full border rounded p-2"
                        />
                        {errors.password && (
                            <p className="text-red-500">{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="Confirm Password"
                            className="w-full border rounded p-2"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-500 text-white p-2 rounded"
                    >
                        {processing ? 'Registering...' : 'Register'}
                    </button>
                </form>
            </div>
        </GuestLayout>
    );
};

export default Register;
