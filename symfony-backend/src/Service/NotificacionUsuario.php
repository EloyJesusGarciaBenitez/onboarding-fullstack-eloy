<?php

namespace App\Service;

use App\Entity\Usuario;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\Address;
use Twig\Environment;

class NotificacionUsuario
{
    public function __construct(
        private readonly MailerInterface $mailer,
        private readonly Environment $twig
    ) {}

    public function enviarBienvenida(Usuario $usuario): void
    {
        $html = $this->twig->render('emails/bienvenida.html.twig', [
            'usuario' => $usuario
        ]);

        $email = (new Email())
            ->from(new Address('no-reply@todoapp.com', 'To-Do App'))
            ->to($usuario->getEmail())
            ->subject('¡Bienvenido a la App!')
            ->html($html);

        $this->mailer->send($email);
    }

    public function enviarResetPassword(Usuario $usuario, string $passwordTemporal): void
    {
        $html = $this->twig->render('emails/reset_password.html.twig', [
            'usuario' => $usuario,
            'passwordTemporal' => $passwordTemporal
        ]);

        $email = (new Email())
            ->from(new Address('no-reply@todoapp.com', 'To-Do App'))
            ->to($usuario->getEmail())
            ->subject('Restablecer contraseña')
            ->html($html);

        $this->mailer->send($email);
    }
}