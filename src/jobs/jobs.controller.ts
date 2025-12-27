import { Body, Controller, Post } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Post()
  async createJob(@Body('code') code: string) {
    return this.jobsService.createJob(code);
  }
}
