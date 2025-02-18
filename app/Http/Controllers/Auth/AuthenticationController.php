<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthenticationController extends Controller
{
    public function registerView()
    {
        return Inertia::render('Auth/Register');
    }

    public function register(RegisterRequest $request)
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            'birth_date' => $validated['birth_date'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'address' => $validated['address'] ?? null
        ]);

        // Optional: Auto login after registration
        Auth::login($user);

        // Record login attempt
        $user->recordLoginAttempt();

        return redirect()->route('dashboard')
            ->with('success', 'Registration successful');
    }

    public function loginView()
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'login' => ['required'],
            'password' => ['required']
        ]);

        $loginType = filter_var($credentials['login'], FILTER_VALIDATE_EMAIL)
            ? 'email'
            : 'phone';

        $user = User::where($loginType, $credentials['login'])->first();

        if (!$user || !$user->checkPassword($credentials['password'])) {
            return back()->withErrors([
                'login' => 'Invalid credentials'
            ]);
        }

        Auth::login($user);
        $user->updateLoginTimestamp();
        $user->recordLoginAttempt(true, $loginType);

        return redirect()->intended('dashboard');
    }

    public function logout()
    {
        Auth::logout();
        return redirect()->route('home');
    }
}
