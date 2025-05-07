import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/jwt.guard';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await  NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'], // ✅ 'debug' 추가
  });

  app.use(cookieParser());

  //setting for frontend cors
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });


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
