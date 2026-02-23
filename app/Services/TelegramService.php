<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramService
{
    public function send(string $chatId, string $message): bool
    {
        $botToken = config('services.telegram.bot_token');

        if (blank($botToken) || blank($chatId) || blank($message)) {
            return false;
        }

        $response = Http::asForm()->post("https://api.telegram.org/bot{$botToken}/sendMessage", [
            'chat_id' => $chatId,
            'text' => $message,
            'parse_mode' => config('services.telegram.parse_mode', 'HTML'),
            'disable_web_page_preview' => true,
        ]);

        if ($response->failed()) {
            Log::warning('Error enviando notificación a Telegram', [
                'status' => $response->status(),
                'body' => $response->json(),
                'chat_id' => $chatId,
            ]);

            return false;
        }

        return true;
    }

    public function sendToUser(User $user, string $message): bool
    {
        if (!$user->enable_notifications || blank($user->telegram_username)) {
            return false;
        }

        $chatId = $this->normalizeChatId($user->telegram_username);

        return $this->send($chatId, $message);
    }

    public function sendToDefaultChat(string $message): bool
    {
        $defaultChatId = config('services.telegram.default_chat_id');

        if (blank($defaultChatId)) {
            return false;
        }

        return $this->send((string) $defaultChatId, $message);
    }

    public function sendToTarget(string $target, string $message): bool
    {
        if (blank($target)) {
            return false;
        }

        return $this->send($this->normalizeChatId($target), $message);
    }

    private function normalizeChatId(string $telegramUsername): string
    {
        $value = trim($telegramUsername);

        // Si ya es un número, retornarlo directamente
        if (is_numeric($value) || str_starts_with($value, '-100')) {
            return $value;
        }

        // Si es un username (@usuario), intenta resolverlo a chat_id
        if (str_starts_with($value, '@')) {
            $chatId = $this->resolveTelegramUsername($value);
            if ($chatId) {
                return (string) $chatId;
            }
            return $value; // Retorna el username si no se pudo resolver
        }

        // Si no tiene @, lo agregamos
        return '@' . $value;
    }

    private function resolveTelegramUsername(string $username): ?int
    {
        try {
            // Intenta obtener información del usuario/chat usando getChat
            $cleanUsername = ltrim($username, '@');
            $botToken = config('services.telegram.bot_token');

            $response = Http::timeout(5)->get("https://api.telegram.org/bot{$botToken}/getChat", [
                'chat_id' => '@' . $cleanUsername,
            ]);

            if ($response->successful() && $response->json('ok') === true) {
                $chatId = $response->json('result.id');
                Log::info('Username resuelto a chat_id', [
                    'username' => $username,
                    'chat_id' => $chatId,
                ]);
                return $chatId;
            }

            Log::warning('No se pudo resolver username', [
                'username' => $username,
                'response' => $response->json(),
            ]);

            return null;
        } catch (\Exception $e) {
            Log::warning('Error resolviendo username', [
                'username' => $username,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }
}
