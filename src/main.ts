import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/jwt.guard';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { LogInterceptor } from './logging/log.interceptor';
import { LogService } from './logging/log.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'], // ✅ 'debug' 추가
  });

  app.use(cookieParser());

  //setting for frontend cors
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  //setting for swagger
  const config = new DocumentBuilder()
    .setTitle('루파봇 API')
    .setDescription('루파봇 커뮤니티 + 상점 + 대전 API 문서')
    .setVersion('1.0')
    .addBearerAuth() // JWT 인증 사용 시
    .build();

  const document = SwaggerModule.createDocument(app, config);
  writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2));

  SwaggerModule.setup('api-docs', app, document); // http://localhost:3000/api-docs


  //setting for logging service
  const logService = app.get(LogService);
  app.useGlobalInterceptors(new LogInterceptor(logService));



  //setting for guard&&decorater
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));


  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);

  //setting for ExpceptionFilter
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
