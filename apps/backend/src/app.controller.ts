import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('api/health')
  getHealthCheck(): {
    status: string;
    time: Date;
  } {
    return {
      status: 'ok',
      time: new Date(),
    };
  }
}
