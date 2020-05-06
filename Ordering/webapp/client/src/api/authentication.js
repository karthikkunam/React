import axios from 'axios';

const authentication = () => axios.create({
  baseURL: `http://localhost:5000/token`,
  headers: {
    'content-type': 'application/json'
  }
});

export default authentication;