const fetch = require("node-fetch");

const sleep = async (ms) => {
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}


const getDataApi = async (resourceUrl) => {
    const response = await fetch(resourceUrl, {
        method: 'GET',
        headers:{
          'Content-Type': 'application/json',
          'x-api-key' : 'hydRCx060z2bOSeA4hMJ75obJrZZAUZt33oo269z'
        }
      });

    const myJson = await response.json(); //extract JSON from the http response
    return myJson;
  }

  module.exports = {
    getDataApi,
    sleep
  }