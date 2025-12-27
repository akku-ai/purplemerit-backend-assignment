import { Injectable } from '@nestjs/common';
import { jobQueue } from './job.queue';

@Injectable()
export class JobsService {
  async createJob(code: string) {
    const job = await jobQueue.add(
      'execute-code',
      { code },
      {
        jobId: `job-${Date.now()}`, // basic idempotency
      },
    );

    return {
      jobId: job.id,
      status: 'queued',
    };
  }
}
