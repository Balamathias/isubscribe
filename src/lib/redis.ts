import { createClient } from 'redis';

import { Redis } from 'ioredis';

export const redis = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: 19500
    }
});

export const redisIO = new Redis({
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST,
    port: 19500
})