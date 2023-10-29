import { Injectable } from '@nestjs/common';
import db from './db';
import { desc } from 'drizzle-orm';
import { output } from 'migrations/schema';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  async getJobHistory() {
    const result = await db.query.output.findMany({
      orderBy: [desc(output.timestamp)],
    });
    return result;
  }
}
