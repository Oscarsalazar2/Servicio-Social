<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Services\TelegramService;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request, TelegramService $telegram): RedirectResponse
    {
        $request->user()->fill($request->validated());

        $notificationsSettingsChanged = $request->user()->isDirty('enable_notifications')
            || $request->user()->isDirty('telegram_username');

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        if ($notificationsSettingsChanged && $request->user()->enable_notifications && filled($request->user()->telegram_username)) {
            $telegram->sendToUser(
                $request->user(),
                "🔔 <b>Notificaciones activadas</b>\nHola {$request->user()->name}, tu configuración de Telegram se guardó correctamente."
            );
        }

        return Redirect::route('profile.edit');
    }

    public function testTelegram(Request $request, TelegramService $telegram): RedirectResponse
    {
        $data = $request->validate([
            'enable_notifications' => ['required', 'boolean'],
            'telegram_username' => ['required', 'string', 'max:255'],
        ]);

        if (!$data['enable_notifications']) {
            return Redirect::back()->withErrors([
                'telegram_username' => 'Activa las notificaciones antes de probar Telegram.',
            ]);
        }

        $sent = $telegram->sendToTarget(
            $data['telegram_username'],
            "🧪 <b>Prueba de conexión</b>\nHola {$request->user()->name}, tu integración con Telegram funciona correctamente."
        );

        if (!$sent) {
            return Redirect::back()->withErrors([
                'telegram_username' => 'Conexión fallida. Verifica tu usuario/ID de Telegram.',
            ]);
        }

        return Redirect::back()->with('status', '✓ Conexión con Telegram exitosa');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
