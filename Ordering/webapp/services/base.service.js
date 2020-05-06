import * as request from 'request';
import { DEV_BFF_URL, GET, POST } from '../util/constants';
//import { log } from '../logging/logger';
import * as LoggingConstants from '../util/loggingConstants';

//@log
class BaseService {

    httpGet(url){
        return this.call(url, GET);
    }

    httpPost(url, data){
        return this.call(url, POST, data);
    }

    call(urlString, method, data){
        let url =  process.env.bff_base_url || DEV_BFF_URL;
        let options = {
            url: url+urlString,
            method: method,
            body: JSON.stringify(data),
            headers: {
                "content-type": "application/json",
                "traceId": LoggingConstants.TRACE_ID
            }
        };
        return new Promise((resolve, reject) => {
            request(options, (err, response, body) => {
                if(err){
                    reject(err);
                } else if ((response.statusCode !== 200) && (response.statusCode !== 201) && (response.statusCode !== 204)) {
                    resolve({code: response.statusCode, message: JSON.parse(response.body)});
                } else {
                    body? resolve(JSON.parse(body)): resolve(body);
                }
            })
        });
    }
}

export {
    BaseService
}
