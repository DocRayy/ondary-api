import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmOptions } from './database/typeorm.config';
import { featureModules } from './features';
import { XssMiddleware } from './Middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot(typeOrmOptions),
    ServeStaticModule.forRoot(
      {
        rootPath: join(process.cwd(), 'storage', 'uploads'),
        serveRoot: '/uploads',
        serveStaticOptions: {
          index: false,
          fallthrough: false,
          setHeaders: (res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
          },
        },
      },
      {
        rootPath: join(process.cwd(), 'storage', 'uploads'),
        serveRoot: '/storage/uploads',
        serveStaticOptions: {
          index: false,
          fallthrough: false,
          setHeaders: (res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
          },
        },
      },
      {
        rootPath: join(process.cwd(), 'storage', 'downloads'),
        serveRoot: '/downloads',
        serveStaticOptions: {
          index: false,
          fallthrough: false,
          setHeaders: (res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
          },
        },
      },
    ),
    ...featureModules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(XssMiddleware).forRoutes('*'); // apply ke semua route
  }
}
