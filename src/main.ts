import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );

  const port = Number(process.env.PORT) || 3000;
  const env = process.env.NODE_ENV || 'development';

  // Escuchar en 0.0.0.0 es indispensable para Docker
  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 Servidor ejecutándose en http://0.0.0.0:${port} en modo [${env}]`);
}

bootstrap();
