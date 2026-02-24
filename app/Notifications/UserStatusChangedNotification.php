<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserStatusChangedNotification extends Notification
{
    use Queueable;

    public function __construct(
        private readonly string $status,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $appName = config('app.name', 'Estación Meteorológica');

        return match ($this->status) {
            'accepted' => (new MailMessage)
                ->subject('Cuenta aceptada')
                ->greeting('Hola ' . $notifiable->name . ',')
                ->line('Tu cuenta fue aceptada y ya puedes acceder a la plataforma.')
                ->action('Iniciar sesión', url('/login'))
                ->line('Gracias por usar ' . $appName . '.'),

            'rejected' => (new MailMessage)
                ->subject('Solicitud rechazada')
                ->greeting('Hola ' . $notifiable->name . ',')
                ->line('Tu solicitud de acceso fue rechazada por un administrador.')
                ->line('Si consideras que se trata de un error, contacta al equipo de soporte.')
                ->line('Gracias por tu interés en ' . $appName . '.'),

            'suspended' => (new MailMessage)
                ->subject('Cuenta suspendida')
                ->greeting('Hola ' . $notifiable->name . ',')
                ->line('Tu cuenta fue suspendida temporalmente por un administrador.')
                ->line('Mientras esté suspendida no podrás iniciar sesión en la plataforma.')
                ->line('Para más información, contacta al equipo de soporte.'),

            default => (new MailMessage)
                ->subject('Actualización de cuenta')
                ->greeting('Hola ' . $notifiable->name . ',')
                ->line('Se realizó un cambio en el estado de tu cuenta.'),
        };
    }
}
