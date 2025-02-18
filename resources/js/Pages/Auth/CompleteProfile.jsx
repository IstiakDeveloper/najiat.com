import React from 'react';
import { useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

const CompleteProfile = () => {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        birth_date: '',
        gender: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('profile.complete'));
    };

    return (
        <GuestLayout title="Complete Your Profile">
            <div className="max-w-md mx-auto mt-10">
                <h2 className="text-2xl font-bold mb-6">Complete Your Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Your full name"
                            className="w-full border rounded p-2"
                            required
                        />
                        {errors.name && <p className="text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <label>Email (Optional)</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Your email"
                            className="w-full border rounded p-2"
                        />
                        {errors.email && <p className="text-red-500">{errors.email}</p>}
                    </div>

                    <div>
                        <label>Phone (Optional)</label>
                        <input
                            type="tel"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="Your phone number"
                            className="w-full border rounded p-2"
                        />
                        {errors.phone && <p className="text-red-500">{errors.phone}</p>}
                    </div>

                    <div>
                        <label>Gender</label>
                        <select
                            value={data.gender}
                            onChange={(e) => setData('gender', e.target.value)}
                            className="w-full border rounded p-2"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        {errors.gender && <p className="text-red-500">{errors.gender}</p>}
                    </div>

                    <div>
                        <label>Birth Date</label>
                        <input
                            type="date"
                            value={data.birth_date}
                            onChange={(e) => setData('birth_date', e.target.value)}
                            className="w-full border rounded p-2"
                        />
                        {errors.birth_date && <p className="text-red-500">{errors.birth_date}</p>}
                    </div>

                    <div>
                        <label>Address (Optional)</label>
                        <textarea
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="Your address"
                            className="w-full border rounded p-2"
                        ></textarea>
                        {errors.address && <p className="text-red-500">{errors.address}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-500 text-white p-2 rounded"
                    >
                        {processing ? 'Saving...' : 'Complete Profile'}
                    </button>
                </form>
            </div>
        </GuestLayout>
    );
};

export default CompleteProfile;
