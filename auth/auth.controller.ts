import { Body, Controller, Get, Post, Req, Res, Render } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @Render('auth/login')
  loginPage() {
    return { title: 'Login', pageTitle: 'Welcome back' };
  }

  @Get('register')
  @Render('auth/register')
  registerPage() {
    return { title: 'Register', pageTitle: 'Create your account' };
  }

  @Get('profile')
  @Render('auth/profile')
  profilePage(@Req() req: any) {
    const user = req.session?.user ?? { id: 'guest', name: 'Guest', role: 'guest' };
    return { title: 'Profile', user };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }, @Req() req: any, @Res() res: any) {
    const user = this.authService.validateUser(body.email, body.password);
    if (!user) {
      req.session.flash = { type: 'danger', message: 'Please provide a valid email and password.' };
      return res.redirect('/login');
    }

    req.session.user = user;
    req.session.flash = { type: 'success', message: 'Login successful. Welcome back!' };
    return res.redirect('/');
  }

  @Post('register')
  async register(@Body() body: { name: string; email: string; password: string }, @Req() req: any, @Res() res: any) {
    const user = {
      id: 'u-new',
      name: body.name ?? 'New Customer',
      email: body.email,
      role: 'customer',
    };

    req.session.user = user;
    req.session.flash = { type: 'success', message: 'Registration complete. Your account is ready.' };
    return res.redirect('/');
  }

  @Get('logout')
  async logout(@Req() req: any, @Res() res: any) {
    req.session.destroy(() => undefined);
    return res.redirect('/');
  }
}
