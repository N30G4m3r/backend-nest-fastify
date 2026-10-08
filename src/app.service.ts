import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly startTime = Date.now();

  getHello(): string {
    return '<h1>Hola Mundo desde Docker</h1>';
  }

  getHealth() {
    return {
      status: 'ok',
      environment: process.env.NODE_ENV || 'development',
      uptime: Number(((Date.now() - this.startTime) / 1000).toFixed(2)),
    };
  }
}
