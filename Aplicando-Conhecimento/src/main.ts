import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Valida automaticamente o corpo das requisições com base nos DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();

  const porta = process.env.PORT ?? 3000;
  await app.listen(porta);
  console.log(`API de Controle Financeiro rodando em http://localhost:${porta}`);
}
bootstrap();
