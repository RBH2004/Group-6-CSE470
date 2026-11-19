import { Controller, Get, Render } from '@nestjs/common';

@Controller('moderation')
export class ModerationController {
  @Get('flags')
  @Render('moderation/flags')
  flagsPage() {
    return {
      title: 'Moderation queue',
      flags: [
        { id: 'flag-1', reason: 'Price spike over 60% from median', status: 'Pending' },
        { id: 'flag-2', reason: 'Inflated claimed discount', status: 'Escalated' },
      ],
    };
  }
}
