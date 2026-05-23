import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('EcoFlow API')
    .setDescription('API MVP para o EcoFlow - Gestão Inteligente de Resíduos. Esta API gerencia condomínios, moradores, descartes e recompensas.')
    .setVersion('1.0')
    .setContact('EcoFlow Team', 'https://ecoflow.com', 'contato@ecoflow.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Insira o token JWT',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'EcoFlow API Documentation',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
