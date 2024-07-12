import api from './api'

const verboseErrorOutput = (err) =>{
    if(err.response){
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
        console.log(`Error: ${err.response.data.error}`);
      }else{
        console.log(`Error: ${err.message}`);
    }  
}

const get = async (path, params, config = {}) =>{
    config.headers = {
        ...config.headers,
        'Accept': 'application/json, text/plain, */*',
    };
    
    let response;
    try{
        if(params){
            const fullUrl = path + '?' + new URLSearchParams(params).toString();
            response = await api.get(fullUrl, config);   
        }else{
            response = await api.get(path, config);
        }
        return response;
    }catch(err){
        verboseErrorOutput(err);
    }
}

const post = async (path, data, config) =>{
    try{
        const response = await config ? api.post(path, data, config) : api.post(path, data);
        return response;
    }catch(err){
        verboseErrorOutput(err);
    }
}

export default {
    get, post
}