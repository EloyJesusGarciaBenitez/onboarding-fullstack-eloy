<?php

namespace App\Service;

use App\Entity\Usuario;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AdministradorUsuarioService
{
    // 1. Añadimos NotificacionUsuario al constructor
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly NotificacionUsuario $notificacionUsuario // <--- NUEVO
    ) {}

    public function crearUsuario(Usuario $usuario, string $password): void
    {
        $usuario->setPassword($this->passwordHasher->hashPassword($usuario, $password));
        $this->entityManager->persist($usuario);
        $this->entityManager->flush();
        
        // Opcional: También puedes enviar bienvenida aquí si el admin crea al usuario
        $this->notificacionUsuario->enviarBienvenida($usuario);
    }

    public function restablecerPassword(Usuario $usuario): string
    {
        // Generamos una clave aleatoria de 8 caracteres
        $nuevaPassword = bin2hex(random_bytes(4)); 
        
        $usuario->setPassword(
            $this->passwordHasher->hashPassword($usuario, $nuevaPassword)
        );

        $this->entityManager->flush();

        // 2. DISPARAMOS EL ENVÍO DEL CORREO DE RESET
        $this->notificacionUsuario->enviarResetPassword($usuario, $nuevaPassword);

        return $nuevaPassword;
    }
}