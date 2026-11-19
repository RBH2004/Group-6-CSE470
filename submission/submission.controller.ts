import { Body, Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { SubmissionService } from './submission.service.js';

@Controller()
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Get('submit-price')
  @Render('submission-form')
  showSubmissionForm() {
    return { title: 'Submit price', pageTitle: 'Add a new price observation' };
  }

  @Post('submit-price')
  async createSubmission(@Body() body: any, @Req() req: any, @Res() res: any) {
    const duplicate = this.submissionService.detectDuplicate(Number(body.productId ?? 1), body.store, Number(body.price), body.date ?? new Date().toISOString());
    if (duplicate) {
      req.session.flash = { type: 'danger', message: 'Duplicate submission rejected within the 24-hour window.' };
      return res.redirect('/my-submissions');
    }

    req.session.flash = { type: 'success', message: 'Price submitted and flagged for review.' };
    return res.redirect('/my-submissions');
  }

  @Get('my-submissions')
  @Render('my-submissions')
  mySubmissions() {
    return {
      title: 'My submissions',
      submissions: this.submissionService.listMySubmissions(),
    };
  }
}
