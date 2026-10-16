import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('💥 Server Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val: any) => val.message);
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: messages
    });
    return;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    res.status(400).json({
      success: false,
      message: `Duplicate value entered for ${field}. Please use another value.`
    });
    return;
  }

  // Cast error / Invalid ObjectId
  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: `Resource not found with ID of ${err.value}`
    });
    return;
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};
