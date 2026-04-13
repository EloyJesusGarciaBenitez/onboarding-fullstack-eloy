<?php

namespace App\Command;

use App\Entity\Usuario;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:create-admin',
    description: 'Crea un usuario administrador por defecto si no existe.'
)]
final class CreateAdminCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $passwordHasher
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        // Definimos las opciones para que el comando sea flexible
        $this
            ->addOption('email', null, InputOption::VALUE_OPTIONAL, 'Email del admin', 'admin@example.com')
            ->addOption('password', null, InputOption::VALUE_OPTIONAL, 'Password del admin', 'password123')
            ->addOption('nombre', null, InputOption::VALUE_OPTIONAL, 'Nombre del admin', 'Admin por Defecto');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $email = (string) $input->getOption('email');
        $passwordPlano = (string) $input->getOption('password');
        $nombre = (string) $input->getOption('nombre');

        $io->title('Creación de administrador');

        // 1. Comprobamos si el usuario ya existe para no duplicarlo (Idempotencia)
        $usuarioExistente = $this->entityManager->getRepository(Usuario::class)->findOneBy(['email' => $email]);

        if ($usuarioExistente) {
            $io->warning("El usuario con email $email ya existe. No se han hecho cambios.");
            return Command::SUCCESS;
        }

        // 2. Creamos el nuevo usuario
        $usuario = (new Usuario())
            ->setEmail($email)
            ->setNombre($nombre)
            ->setRoles(['ROLE_ADMIN', 'ROLE_USER']);

        // 3. Hasheamos la contraseña
        $usuario->setPassword($this->passwordHasher->hashPassword($usuario, $passwordPlano));

        // 4. Guardamos en la base de datos
        $this->entityManager->persist($usuario);
        $this->entityManager->flush();

        $io->success("Administrador '$email' creado correctamente.");

        return Command::SUCCESS;
    }
}