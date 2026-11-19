import { Body, Controller, Get, Param, Post, Render, Req, Res } from '@nestjs/common';
import { concerns } from '../common/seed-data.js';

@Controller()
export class ConcernController {
  @Get('concerns')
  @Render('concerns')
  concernsPage() {
    return {
      title: 'My concerns',
      concerns,
    };
  }

  @Get('concerns/:id')
  @Render('concern-thread')
  concernThread(@Param('id') id: string) {
    const concern = concerns.find((entry) => entry.id === id) ?? concerns[0];
    return {
      title: 'Concern thread',
      concern,
      messages: [
        { author: 'Customer', body: concern.message },
        { author: 'Brand', body: 'We have reviewed your concern and will update shortly.' },
      ],
    };
  }

  @Post('concerns')
  async submitConcern(@Body() body: any, @Req() req: any, @Res() res: any) {
    concerns.push({
      id: `c-${Date.now()}`,
      customerLabel: 'Customer #A99',
      productId: Number(body.productId ?? 1),
      status: 'Open',
      type: body.type ?? 'misleading price',
      message: body.message ?? 'Raised after checking included invoice.',
    });

    req.session.flash = { type: 'success', message: 'Concern raised successfully.' };
    return res.redirect('/concerns');
  }
}
