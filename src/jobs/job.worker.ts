import { Worker } from 'bullmq';
import { redisConnection } from './redis.connection';

new Worker(
  'code-jobs',
  async job => {
    console.log('Processing job:', job.id);

    // Simulate async processing (code execution mock)
    await new Promise(resolve => setTimeout(resolve, 3000));

    if (Math.random() < 0.2) {
      throw new Error('Random execution failure');
    }

    return {
      status: 'success',
      output: 'Code executed successfully',
    };
  },
  {
    connection: redisConnection,
  },
);
