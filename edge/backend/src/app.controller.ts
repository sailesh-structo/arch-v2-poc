import {
  BadRequestException,
  Controller,
  Get,
  // HttpException,
  Post,
  Req,
  Res,
  Sse,
  // UploadedFile,
  // UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Subject } from 'rxjs';
import {
  Client,
  ClientKafka,
  MessagePattern,
  Payload,
  Transport,
} from '@nestjs/microservices';
import { FastifyReply, FastifyRequest } from 'fastify';
import * as util from 'util';
import * as fs from 'fs';
import * as stream from 'stream';
import { randomUUID } from 'crypto';

const pump = util.promisify(stream.pipeline);

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'kafkaSample',
        brokers: [process.env.KAFKA_BROKER_LIST],
      },
      consumer: {
        groupId: 'backend',
      },
    },
  })
  client: ClientKafka;

  resp = new Subject();

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  async uploadFile(@Req() req: FastifyRequest, @Res() res: FastifyReply<any>) {
    if (!req.isMultipart()) {
      res.send(new BadRequestException('Request is not multipart'));
      return;
    }

    const parts = req.files();
    for await (const part of parts) {
      const filePath = `${process.env.UPLOAD_FILE_PATH}/${part.filename}`;
      await pump(part.file, fs.createWriteStream(filePath));
      const message = {
        jobId: randomUUID(),
        filePath,
        machineId: process.env.MACHINE_ID,
      };
      this.client.emit('start_job', message);
      console.log('start_job emitted', message);
    }
    res.send();
  }

  @Get('app')
  app(@Res() res) {
    res.sendFile('index.html', { root: 'public' });
  }

  @Sse('sse')
  sse() {
    console.log('sse');
    return this.resp;
  }

  @MessagePattern('output')
  consumeLine(@Payload() payload) {
    console.log(payload);
    this.resp.next({ data: payload });
  }

  @Get('job_history')
  async getJobHistory() {
    return await this.appService.getJobHistory();
  }
}
