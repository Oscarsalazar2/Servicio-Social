<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),

            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'role' => $user->role ?? null,
                    'is_admin' => ($user->role ?? null) === 'admin', // opcional
                ] : null,
            ],

            'flash' => [
                'registrationPending' => (bool) $request->session()->get('registration_pending'),
            ],
        ];
    }
}
