const redis = require('redis');

const redisClient = redis.createClient({
    port: 6379,
    hostName: 'http://localhost',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
    console.log('redis connect')
    await redisClient.connect();
})();

module.exports = redisClient;
