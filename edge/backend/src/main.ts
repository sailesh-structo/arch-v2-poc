import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
// import { ExpressAdapter } from '@nestjs/platform-express';
// import * as spdy from 'spdy';
// import * as express from 'express';
// import * as fastify from 'fastify';
// import * as http2 from 'http2';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as FastifyMultipart from '@fastify/multipart';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./secrets/private-key.key'),
    cert: fs.readFileSync('./secrets/public-certificate.crt'),
    allowHTTP1: true,
    // maxHeaderListPairs: 512000,
    // maxDeflateDynamicTableSize: 8000,
  };
  // const server = express();
  // const server = fastify({
  //   http2: true,
  //   https: httpsOptions,
  // }).register(FastifyMultipart)
  // const h2server = spdy.createServer(httpsOptions, server);
  // const h2server = http2.createSecureServer(httpsOptions);
  // server.set('view engine', 'ejs');
  // const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      // http2: true,
      // https: httpsOptions,
    }),
  );
  app.register(FastifyMultipart as any);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER_LIST],
      },
      consumer: {
        groupId: 'backend',
      },
    },
  });
  await app.startAllMicroservices();
  app.enableCors();
  await app.listen(4000, '0.0.0.0');
  // await app.init();
  // h2server.listen(4000);
}
bootstrap();
