import * as RedisClient from 'ioredis';
import * as dns from 'dns';
import * as chalk from 'chalk';
//import { logMethodDecorator } from '../logging/logger';

const warning = chalk.yellowBright;
const redis = async () => {
  let servers = await getRedisServerList();
  if(servers.length > 1){
    return new RedisClient.Cluster(servers, {
      slotsRefreshTimeout: 2000
    });
  } else {
    return new RedisClient(servers[0]);
  }
}

const getRedisServerList = () => {
  let servers = [];
  let singleServer = [{ host: process.env.REDIS_URL, port: process.env.REDIS_PORT }];
  return new Promise((resolve, reject) => {
    try {
      if(process.env.REDIS_URL == 'localhost'){
        resolve(singleServer);
      } else {
        dns.resolve(process.env.REDIS_URL, (error, result) => {

          if (error) {
              logger.error(`${JSON.stringify(error)} Unable to identify Redis Nodes in Cluster`);
              resolve(singleServer);
            } else {
              result.forEach(item => {
                  servers.push({host: item, port:process.env.REDIS_PORT});
              });
              logger.debug(`Redis Nodes in Cluster: ${JSON.stringify(servers)}`);
              resolve(servers);
            }
        });
      }
    } catch (error) {
      resolve(singleServer);
    }
  });
}

class RedisUtil {
    //@logMethodDecorator
    static async setToRedis(key, value) {
        try {
            let servers = await getRedisServerList();
            logger.debug('REDIS SERVERS: ', JSON.stringify(servers));
            let redisInst = await redis();
            return new Promise((resolve, reject) => {
                redisInst.set(key, value, function (result) {
                    resolve(result);
                });
            });
        }
        catch (exception) {
            throw exception;
        }
    };

    //@logMethodDecorator
    static async getFromRedis(key) {
        try {
            let redisInst = await redis();
            return new Promise((resolve, reject) => {
                redisInst.get(key, function (err, value) {
                    if (err) {
                        throw err;
                    } else {
                        resolve(value);
                    }
                });
            });
        }
        catch (exception) {
            throw exception;
        }
    };
}

export {
    RedisUtil
}
