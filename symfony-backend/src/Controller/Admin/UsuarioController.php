<?php

namespace App\Controller\Admin;

use App\Entity\Usuario;
use App\Service\AdministradorUsuarioService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/admin/users')]
class UsuarioController extends AbstractController
{
    #[Route('', methods: ['POST'])]
    public function crear(Request $request, AdministradorUsuarioService $service): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        // Creamos el objeto Usuario manualmente para pasarlo al servicio
        $usuario = new Usuario();
        $usuario->setEmail($data['email']);
        $usuario->setNombre($data['nombre']);
        // ... set de otros campos si son necesarios ...

        $service->crearUsuario($usuario, $data['password']);
        
        return $this->json($usuario, 201);
    }

    #[Route('/{id}/reset-password', methods: ['POST'])]
    public function reset(Usuario $usuario, AdministradorUsuarioService $service): JsonResponse
    {
        // IMPORTANTE: El nombre debe ser restablecerPassword
        $password = $service->restablecerPassword($usuario);
        
        return $this->json([
            'message' => 'Contraseña restablecida y enviada por email',
            'temp_password' => $password
        ]);
    }
}