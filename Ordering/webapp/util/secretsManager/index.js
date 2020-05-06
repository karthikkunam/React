import AWS from 'aws-sdk';
import fs from "fs";

class SecretsManager {
    async getPublicKey() {
        console.log('Getting publickey');
        return process.env.PUBLIC_KEY ? process.env.PUBLIC_KEY : await this.getSecret('publickey');
    }

    async getPrivateKey() {
        console.log(`Getting privatekey`);
        return process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY : await this.getSecret('privatekey');
    }

    async getSecret(key) {
        try {
            if (process.env.ENVIRONMENT === 'local') {
                logger.debug(`Reading ${key} from file...`);
                if (key === 'privatekey') {
                    let privateKey = fs.readFileSync(__dirname + '/private.key', 'utf8');
                    return Promise.resolve(privateKey);
                } else if (key === 'publickey') {
                    let publicKey = fs.readFileSync(__dirname + '/public.key', 'utf8');
                    return Promise.resolve(publicKey);
                }
            }
            if (key) {
                AWS.config.setPromisesDependency(require('bluebird'));

                const AWSConfig = {
                    region: 'us-east-1',
                    secretName: 'ordering'
                };
                const AWSClient = new AWS.SecretsManager({
                    region: AWSConfig.region
                });
                const SecretId = `${AWSConfig.secretName}/${key}`;
                const data = await AWSClient.getSecretValue({SecretId: SecretId}).promise();
                if (data && data.SecretString) {
                    if (key === 'privatekey') {
                        process.env.PRIVATE_KEY = data.SecretString;
                    } else if (key === 'publickey') {
                        process.env.PUBLIC_KEY = data.SecretString;
                    }
                    return Promise.resolve(data.SecretString);
                } else {
                    logger.debug(`Failed to get ${key} from AWS`);
                    console.log(`Failed to get ${key} from AWS`);
                    return Promise.reject(`Failed to get ${key} from AWS`);
                }
            }
        } catch (err) {
            logger.error(`${JSON.stringify(err)}, Error getting secret from secrets manager`);
            console.log(`${JSON.stringify(err)}, Error getting secret from secrets manager`);
            return Promise.reject(`${JSON.stringify(err)}, Error getting secret from secrets manager`);
        }
    }
}

let secretsManager = new SecretsManager();

export {
    secretsManager
}
