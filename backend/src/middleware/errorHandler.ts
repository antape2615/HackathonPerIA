import { Request, Response, NextFunction } from 'express'

export interface AppError extends Error {
  statusCode?: number
  isOperational?: boolean
}

import { Prisma } from '@prisma/client'

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('ERROR 💥', err);

  let statusCode = err.statusCode || 500;
  let message = err.message;

  if (err.isOperational) {
    return res.status(statusCode).json({
      success: false,
      error: message,
    });
  }

  // Errores específicos de Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Violación de restricción única (ej. email duplicado)
    if (err.code === 'P2002') {
      statusCode = 409; // Conflict
      const target = (err.meta as any)?.target || ['field'];
      message = `El valor para ${target[0]} ya existe.`;
    }
  }

  // Para todos los demás errores, enviar una respuesta genérica
  if (statusCode === 500) {
    message = 'Ocurrió un error inesperado en el servidor. Por favor, intenta de nuevo más tarde.';
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack, originalError: err.message })
  });
};
