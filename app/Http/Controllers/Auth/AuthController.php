<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    // Login View
    public function loginView()
    {
        return Inertia::render('Auth/Login');
    }

    // Login Method
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'login_identifier' => ['required', 'string'],
            'password' => ['required', 'string']
        ]);

        // Find user by email or phone
        $user = User::where('login_identifier', $credentials['login_identifier'])->first();

        if (!$user || !Auth::attempt([
            'login_identifier' => $credentials['login_identifier'],
            'password' => $credentials['password']
        ])) {
            throw ValidationException::withMessages([
                'login_identifier' => ['The provided credentials are incorrect.'],
            ]);
        }

        $request->session()->regenerate();

        // Redirect based on profile completion
        return $user->profile_completed
            ? redirect()->intended(route('dashboard'))
            : redirect()->route('profile.complete');
    }

    // Registration View
    public function registerView()
    {
        return Inertia::render('Auth/Register');
    }

    // Registration Method
    public function register(Request $request)
    {
        $validated = $request->validate([
            'login_identifier' => [
                'required',
                'string',
                'unique:users,login_identifier',
                function ($attribute, $value, $fail) {
                    if (!filter_var($value, FILTER_VALIDATE_EMAIL) &&
                        !preg_match('/^[0-9]{10,14}$/', $value)) {
                        $fail('Please provide a valid email or phone number.');
                    }
                }
            ],
            'password' => [
                'required',
                'confirmed',
                'min:8'
            ]
        ]);

        // Determine login type
        $loginType = filter_var($validated['login_identifier'], FILTER_VALIDATE_EMAIL)
            ? 'email'
            : 'phone';

        // Create user
        $user = User::create([
            'login_identifier' => $validated['login_identifier'],
            'password' => $validated['password'],
            $loginType => $validated['login_identifier']
        ]);

        // Login the user
        Auth::login($user);

        // Redirect to complete profile
        return redirect()->route('dashboard');
    }

    // Profile Completion View
    public function completeProfileView()
    {
        return Inertia::render('Auth/CompleteProfile');
    }

    // Complete Profile Method
    public function completeProfile(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'unique:users,email,' . $user->id],
            'phone' => ['nullable', 'regex:/^[0-9]{10,14}$/', 'unique:users,phone,' . $user->id],
            'address' => ['nullable', 'string', 'max:500'],
            'birth_date' => ['nullable', 'date', 'before:today'],
            'gender' => ['nullable', 'in:male,female,other']
        ]);

        // Update user profile
        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'] ?? $user->email,
            'phone' => $validated['phone'] ?? $user->phone,
            'address' => $validated['address'],
            'birth_date' => $validated['birth_date'],
            'gender' => $validated['gender'],
            'profile_completed' => true
        ]);

        return redirect()->route('dashboard')
            ->with('success', 'Profile completed successfully');
    }

    // Logout
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }
}
