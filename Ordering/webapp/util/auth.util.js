import fs from 'fs';
import * as crypto from 'crypto';
import { logMethodDecorator } from '../logging/logger';
import { secretsManager } from '../util/secretsManager/index';

class AuthUtil {
    static async decrypt(encryptedData) {
        let privateKey = await secretsManager.getPrivateKey();
        let decodedBuffer = Buffer.from(decodeURIComponent(encryptedData), "base64");
        let decodedPayload = await crypto.privateDecrypt({ key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING }, decodedBuffer);
        let decryptedPayload = JSON.parse(decodedPayload.toString('utf8'));
        return decryptedPayload;
    }

    static async encrypt(toEncrypt) {
      let publicKey = await secretsManager.getPublicKey();
      let payloadBuffer = Buffer.from(toEncrypt);
      let encrypted = crypto.publicEncrypt({ key: publicKey, padding: crypto.constants.RSA_PKCS1_PADDING }, payloadBuffer);
      let encryptedPayload = encrypted.toString('base64');
      return (encodeURIComponent(encryptedPayload));
    }
}

export {
    AuthUtil
}
