import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express, Request, Response, NextFunction } from 'express';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';

let cachedServer: Express;

async function bootstrapServer(): Promise<Express> {
  const expressApp = express();

  // Root health check endpoint for Vercel
  expressApp.get('/', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      message: '🚀 Edukad Backend API is running on Vercel Serverless!',
      version: '1.0.0',
      endpoints: {
        roadmaps: '/api/roadmaps',
        notifications: '/api/notifications',
      },
    });
  });

  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
    logger: ['error', 'warn', 'log'],
  });

  // Disable ETag generation
  expressApp.set('etag', false);

  // Disable all caching
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store',
    });
    next();
  });

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Global exception filter to return descriptive error info
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global API route prefix
  app.setGlobalPrefix('api');

  await app.init();
  return expressApp;
}

export default async function handler(req: any, res: any) {
  try {
    if (!cachedServer) {
      cachedServer = await bootstrapServer();
    }
    return cachedServer(req, res);
  } catch (err: any) {
    console.error('CRITICAL: Vercel Serverless Function Crash:', err);
    return res.status(500).json({
      error: 'FUNCTION_INVOCATION_FAILED',
      message: err?.message || String(err),
      details: 'Check that DATABASE_URL, SUPABASE_URL, and JWT_SECRET are configured in Vercel project settings.',
    });
  }
}
