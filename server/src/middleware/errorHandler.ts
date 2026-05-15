import type { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  if (err instanceof ZodError) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const field = issue.path.join('.') || '_root';
      fieldErrors[field] ??= [];
      fieldErrors[field].push(issue.message);
    }
    res.status(400).json({
      message: 'Datos inválidos',
      errors: fieldErrors,
    });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({
      message: err.message,
      ...(err.errors ? { errors: err.errors } : {}),
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = err.meta?.target as string[] | undefined;
      const labels: Record<string, string> = {
        fifa_code: 'código FIFA',
        fifa_ranking: 'ranking FIFA',
        country_name: 'nombre del país',
        name: 'nombre',
      };
      const friendly = target
        ?.map((t) => labels[t] ?? t)
        .join(', ');
      res.status(409).json({
        message: friendly
          ? `Ya existe un registro con el mismo ${friendly}`
          : 'Ya existe un registro duplicado',
      });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({ message: 'Registro no encontrado' });
      return;
    }
    if (err.code === 'P2003' || err.code === 'P2014') {
      res.status(409).json({
        message:
          'No se puede eliminar este registro porque está siendo usado en otro lugar',
      });
      return;
    }
  }

  if (
    err instanceof Prisma.PrismaClientUnknownRequestError &&
    /foreign key|RESTRICT|violates/i.test(err.message)
  ) {
    res.status(409).json({
      message:
        'No se puede eliminar este registro porque está siendo usado en otro lugar',
    });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Error interno del servidor' });
};

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
};
