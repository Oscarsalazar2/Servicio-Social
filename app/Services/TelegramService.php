<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Log;
use Telegram\Bot\Api;

class TelegramService
{
    private ?Api $telegram = null;

    public function send(string $chatId, string $message): bool
    {
        if (blank(config('services.telegram.bot_token')) || blank($chatId) || blank($message)) {
            return false;
        }

        try {
            $telegram = $this->client();

            if (!$telegram) {
                return false;
            }

            $telegram->sendMessage([
                'chat_id' => $chatId,
                'text' => $message,
                'parse_mode' => config('services.telegram.parse_mode', 'HTML'),
                'disable_web_page_preview' => true,
            ]);

            return true;
        } catch (\Throwable $exception) {
            Log::warning('Error enviando notificación a Telegram', [
                'chat_id' => $chatId,
                'error' => $exception->getMessage(),
            ]);

            return false;
        }
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
            $cleanUsername = ltrim($username, '@');
            $telegram = $this->client();

            if (!$telegram) {
                return null;
            }

            $chat = $telegram->getChat([
                'chat_id' => '@' . $cleanUsername,
            ]);

            $chatId = $chat->get('id');

            if ($chatId) {
                Log::info('Username resuelto a chat_id', [
                    'username' => $username,
                    'chat_id' => $chatId,
                ]);

                return $chatId;
            }

            Log::warning('No se pudo resolver username', [
                'username' => $username,
            ]);

            return null;
        } catch (\Throwable $e) {
            Log::warning('Error resolviendo username', [
                'username' => $username,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    private function client(): ?Api
    {
        if ($this->telegram instanceof Api) {
            return $this->telegram;
        }

        $botToken = (string) config('services.telegram.bot_token');

        if (blank($botToken)) {
            return null;
        }

        try {
            $this->telegram = new Api($botToken);

            return $this->telegram;
        } catch (\Throwable $exception) {
            Log::warning('No se pudo inicializar el cliente de Telegram', [
                'error' => $exception->getMessage(),
            ]);

            return null;
        }
    }
}
