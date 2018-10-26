import axios from 'axios';

const instance = axios.create({
    baseURL : 'https://burger-f622a.firebaseio.com/'
});

export default instance;