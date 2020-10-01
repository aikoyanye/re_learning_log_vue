import axios from 'axios'
axios.defaults.withCredentials = true;

let http = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
    // baseURL: 'http://127.0.0.1:8001'
    baseURL: 'http://120.77.153.248:8001'
});

http.interceptors.request.use(config=>{
    if(config.method == 'post'){
        config.data = JSON.stringify(config.data)
    }
    return config
});

export default function(){
    return http
}