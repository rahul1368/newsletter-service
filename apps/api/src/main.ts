import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Newsletter Service API')
    .setDescription(
      'A newsletter service that sends pre-decided content to subscribers at specified intervals/time. Supports topic-based subscriptions and automatic email scheduling.',
    )
    .setVersion('1.0')
    .addTag('subscribers', 'Subscriber management endpoints')
    .addTag('topics', 'Topic management endpoints')
    .addTag('subscriptions', 'Subscription management endpoints')
    .addTag('content', 'Content management and scheduling endpoints')
    .addTag('health', 'Health check endpoints')
    .addTag('stats', 'Statistics endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Newsletter Service API',
    customfavIcon: '/favicon.ico',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
