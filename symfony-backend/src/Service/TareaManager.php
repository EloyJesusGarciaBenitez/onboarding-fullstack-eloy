<?php

namespace App\Service;

use App\Entity\Tarea;
use App\Entity\Usuario;
use App\Repository\TareaRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class TareaManager
{
    /**
     * Estados permitidos para evitar errores de escritura.
     */
    private const ESTADOS_VALIDOS = ['pendiente', 'en_progreso', 'completada'];

    public function __construct(
        private readonly TareaRepository $tareaRepository,
        private readonly EntityManagerInterface $entityManager
    ) {
    }

    /**
     * Lista tareas usando el repositorio personalizado.
     */
    public function listarPorUsuario(int $usuarioId, array $filtros = []): array
    {
        return $this->tareaRepository->buscarPorFiltros(
            $usuarioId,
            $filtros['estado'] ?? null,
            $filtros['texto'] ?? null
        );
    }

    /**
     * Crea una tarea con validación de título y fecha (Mini Reto 1).
     */
    public function crear(array $payload, Usuario $usuario): Tarea
    {
        $titulo = $payload['titulo'] ?? null;
        $estado = $payload['estado'] ?? 'pendiente';

        if (!$titulo) {
            throw new BadRequestHttpException('El título es obligatorio.');
        }

        // --- MINI RETO 1: Validación de fecha límite ---
        if (isset($payload['fechaLimite'])) {
            $fechaLimite = new \DateTime($payload['fechaLimite']);
            $ahora = new \DateTime();

            if ($fechaLimite < $ahora) {
                throw new BadRequestHttpException('La fecha límite no puede ser anterior a la fecha actual.');
            }
        }
        // -----------------------------------------------

        if (!in_array($estado, self::ESTADOS_VALIDOS, true)) {
            throw new BadRequestHttpException('Estado no válido.');
        }

        $tarea = (new Tarea())
            ->setTitulo($titulo)
            ->setDescripcion($payload['descripcion'] ?? null)
            ->setEstado($estado)
            ->setFechaCreacion(new \DateTimeImmutable())
            ->setFechaLimite(isset($payload['fechaLimite']) ? new \DateTime($payload['fechaLimite']) : null)
            ->setUsuario($usuario);

        $this->entityManager->persist($tarea);
        $this->entityManager->flush();

        return $tarea;
    }

    /**
     * Actualiza los datos de una tarea existente.
     */
    public function actualizar(Tarea $tarea, array $payload): Tarea
    {
        if (isset($payload['titulo']) && $payload['titulo'] === '') {
            throw new BadRequestHttpException('El título no puede quedar vacío.');
        }

        if (isset($payload['estado']) && !in_array($payload['estado'], self::ESTADOS_VALIDOS, true)) {
            throw new BadRequestHttpException('Estado no válido.');
        }

        $tarea
            ->setTitulo($payload['titulo'] ?? $tarea->getTitulo())
            ->setDescripcion($payload['descripcion'] ?? $tarea->getDescripcion())
            ->setEstado($payload['estado'] ?? $tarea->getEstado())
            ->setFechaLimite(isset($payload['fechaLimite']) ? new \DateTime($payload['fechaLimite']) : $tarea->getFechaLimite());

        $this->entityManager->flush(); 

        return $tarea;
    }

    /**
     * Elimina la tarea de la base de datos.
     */
    public function eliminar(Tarea $tarea): void
    {
        $this->entityManager->remove($tarea);
        $this->entityManager->flush();
    }

    /**
     * Seguridad: Garantiza que la tarea pertenece al usuario.
     */
    public function aseguraPerteneceAUsuario(?Tarea $tarea, int $usuarioId): Tarea
    {
        if (!$tarea || $tarea->getUsuario()?->getId() !== $usuarioId) {
            throw new NotFoundHttpException('Tarea no encontrada para este usuario.');
        }

        return $tarea;
    }
}