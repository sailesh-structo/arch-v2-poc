import { Injectable } from '@nestjs/common';
import db from './db';
import { output } from 'migrations/schema';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  async getJobHistory() {
    const result = await db.select().from(output);
    return result;
  }
}
