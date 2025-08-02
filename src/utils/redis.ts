import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379'); // default localhost:6379, atau bisa tambahkan config

export default redis;