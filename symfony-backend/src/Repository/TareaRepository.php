<?php

namespace App\Repository;

use App\Entity\Tarea;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Tarea>
 */
class TareaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Tarea::class);
    }

    //    /**
    //     * @return Tarea[] Returns an array of Tarea objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('t')
    //            ->andWhere('t.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('t.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Tarea
    //    {
    //        return $this->createQueryBuilder('t')
    //            ->andWhere('t.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
    /**
     * Devuelve todas las tareas de un usuario ordenadas por fecha.
     */
    public function findByUsuarioOrdenadas(int $usuarioId): array
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.usuario = :usuarioId')
            ->setParameter('usuarioId', $usuarioId)
            ->orderBy('t.fechaCreacion', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Busca tareas con filtros opcionales de estado y texto.
     */
    public function buscarPorFiltros(int $usuarioId, ?string $estado, ?string $texto): array
    {
        $qb = $this->createQueryBuilder('t')
            ->andWhere('t.usuario = :usuarioId')
            ->setParameter('usuarioId', $usuarioId);

        if ($estado) {
            $qb->andWhere('t.estado = :estado')
               ->setParameter('estado', $estado);
        }

        if ($texto) {
            $qb->andWhere('LOWER(t.titulo) LIKE :texto OR LOWER(t.descripcion) LIKE :texto')
               ->setParameter('texto', '%' . mb_strtolower($texto) . '%');
        }

        return $qb->orderBy('t.fechaCreacion', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * RETO: Tareas pendientes cuya fecha límite está próxima.
     */
    public function findPendientesPorVencer(int $usuarioId, \DateInterval $intervalo): array
    {
        $fechaLimiteMaxima = (new \DateTime())->add($intervalo);

        return $this->createQueryBuilder('t')
            ->andWhere('t.usuario = :usuarioId')
            ->andWhere('t.estado = :estado')
            ->andWhere('t.fechaLimite <= :limite')
            ->setParameter('usuarioId', $usuarioId)
            ->setParameter('estado', 'pendiente')
            ->setParameter('limite', $fechaLimiteMaxima)
            ->getQuery()
            ->getResult();
    }
}
