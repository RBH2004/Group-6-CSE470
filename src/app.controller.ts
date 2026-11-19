import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('style-guide')
  @Render('style-guide')
  styleGuide() {
    return { title: 'Style guide' };
  }

  @Get('403')
  @Render('errors/forbidden')
  forbidden() {
    return { title: 'Forbidden' };
  }

  @Get('404')
  @Render('errors/not-found')
  notFound() {
    return { title: 'Page not found' };
  }

  @Get('health')
  getHealth(): { status: string } {
    return { status: this.appService.getHello() };
  }
}
