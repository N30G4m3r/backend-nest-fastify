import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    const env = process.env.NODE_ENV || 'development';
    this.logger.log(`GET / consultado - Entorno: ${env}`);
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    const env = process.env.NODE_ENV || 'development';
    this.logger.log(`GET /health consultado - Entorno: ${env}`);
    return this.appService.getHealth();
  }
}
