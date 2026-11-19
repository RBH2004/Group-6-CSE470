import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';
import session from 'express-session';
import hbs from 'hbs';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const expressApp = app.getHttpAdapter().getInstance();

  expressApp.use(express.static(join(process.cwd(), 'public')));
  expressApp.use('/app', express.static(join(process.cwd(), 'frontend', 'dist')));
  expressApp.set('views', join(process.cwd(), 'src', 'views'));
  expressApp.set('view engine', 'hbs');
  const partialsDir = join(process.cwd(), 'src', 'views', 'partials');
  const partialFiles = readdirSync(partialsDir);
  for (const file of partialFiles) {
    if (file.endsWith('.hbs') || file.endsWith('.html')) {
      const name = file.replace(/\.(hbs|html)$/, '');
      const content = readFileSync(join(partialsDir, file), 'utf8');
      hbs.registerPartial(name, content);
      hbs.registerPartial(name.replace(/-/g, '_'), content);
    }
  }
  hbs.registerHelper('eq', (a: unknown, b: unknown) => a === b);
  hbs.registerHelper('times', (n: number, options: any) => {
    let out = '';
    for (let i = 0; i < n; i += 1) {
      out += options.fn(i);
    }
    return out;
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET ?? 'brandtruth-demo-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1000 * 60 * 60 * 24 },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.use((req: any, res: any, next: () => void) => {
    res.locals.user = req.session?.user ?? null;
    res.locals.flash = req.session?.flash ?? null;
    if (req.session?.flash) {
      delete req.session.flash;
    }
    next();
  });

  await app.listen(process.env.PORT ?? 3000);
}

await bootstrap();
