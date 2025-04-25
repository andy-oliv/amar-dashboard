import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.use(cookieParser(process.env.COOKIE_SECRET));

  const config = new DocumentBuilder()
    .setTitle('Amar Dashboard API')
    .setDescription(
      'An interactive web dashboard for **Amar Infâncias**, a family photography business. This tool is designed to visualize and manage contract data, helping track growth, trends, and important metrics from internal systems.',
    )
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  const swaggerOptions = {
    customSiteTitle: 'Amar Infâncias API Docs',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { background-color: #5951a2; }
      #logo_small_svg__SW_TM-logo-on-dark { display: none; }
      .swagger-ui .topbar .topbar-wrapper::before {
        content: '';
        background-image: url('/logo.png'); 
        background-repeat: no-repeat;
        background-size: contain;
        height: 70px; 
        width: 170px;
        display: inline-block;
        margin-right: 10px;
      }
    `,
  };

  SwaggerModule.setup('docs', app, documentFactory, swaggerOptions);

  await app.listen(3000);
}
bootstrap();
