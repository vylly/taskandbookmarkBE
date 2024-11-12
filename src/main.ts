import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule } from '@nestjs/config';

async function bootstrap() {
  ConfigModule.forRoot();
  const app = await NestFactory.create(AppModule);
  console.log('listening on port: ', process.env.PORT);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
