import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import AppError from '../utils/AppError.js';

export const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // console.error('ERROR :', err);

  // Handle specific error types
  if (err instanceof ZodError) {
    error = handleZodError(err);
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    error = handlePrismaError(err);
  } else if (err instanceof Prisma.PrismaClientValidationError) {
     error = handlePrismaValidationError(err);
  }

  // Ensure status code and status are set
  const statusCode = error.statusCode || 500;
  const status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    // Production: send generic message for unknown errors
    if (error.isOperational) {
      sendErrorProd(error, res);
    } else {
      // console.error('ERROR :', err); // Log unknown errors
      res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!',
      });
    }
  }
};

const handleZodError = (err) => {
  console.log(err?.message)
  const message = err[0]?.message;
  return new AppError(`Validation Error: ${message}`, 400);
};

const handlePrismaError = (err) => {
  switch (err.code) {
    case 'P2002':
      return new AppError(`Duplicate field value: ${err.meta.target}`, 400);
    case 'P2025':
      return new AppError('Record not found', 404);
    default:
      return new AppError(`Database Error: ${err.message}`, 500);
  }
};

const handlePrismaValidationError = (err) => {
    return new AppError(`Invalid data provided to database query: ${err.message}`, 400);
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status,
    message: err.message,
  });
};
