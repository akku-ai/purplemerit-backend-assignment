import { Queue } from 'bullmq';
import { redisConnection } from './redis.connection';

export const jobQueue = new Queue('code-jobs', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});
