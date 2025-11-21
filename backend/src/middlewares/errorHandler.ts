import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../utils/httpError';

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const message = err instanceof Error ? err.message : 'Erro interno do servidor';

  // Logging simples
  // eslint-disable-next-line no-console
  console.error(err);

  res.status(statusCode).json({
    message,
    statusCode,
  });
}
