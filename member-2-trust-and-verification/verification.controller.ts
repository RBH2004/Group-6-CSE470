import { Body, Controller, Get, Param, Post, Render, Req, Res } from '@nestjs/common';
import { VerificationService } from '../common/verification.service.js';
import { submissions } from '../common/seed-data.js';

@Controller()
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Get('verification-feed')
  @Render('verification-feed')
  verificationFeed() {
    return {
      title: 'Verification Feed',
      items: submissions.map((submission) => ({
        ...submission,
        summary: this.verificationService.summarize([
          { userId: 'u-2', trustWeight: 1.2, decision: 'confirm' },
          { userId: 'u-3', trustWeight: 1.1, decision: 'confirm' },
        ]),
      })),
    };
  }

  @Post('verification-feed/:id/vote')
  async vote(@Param('id') id: string, @Body() body: { decision: 'confirm' | 'dispute' }, @Req() req: any, @Res() res: any) {
    const summary = this.verificationService.summarize([
      { userId: 'u-1', trustWeight: 1.4, decision: 'confirm' },
      { userId: 'u-2', trustWeight: 1.3, decision: body.decision },
    ]);

    req.session.flash = {
      type: summary.status === 'Verified' ? 'success' : 'info',
      message: `Vote recorded. Current status: ${summary.status}.`,
    };
    return res.redirect('/verification-feed');
  }
}
