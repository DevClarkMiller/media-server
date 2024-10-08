import api from './api'

const verboseErrorOutput = err =>{
    if(err.response){
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
        console.log(`Error: ${err.response.data.error}`);
      }else{
        console.log(`Error: ${err.message}`);
    }  
}
const simpleErrorOutput = err =>{
    if(err.response){
        console.log(err.response.status);
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
        if(process.env.REACT_APP_VERBOSE_ERROR === "true"){
            verboseErrorOutput(err);
        }else{
            simpleErrorOutput(err);
        }
        return err.response;
    }
}

const post = async (path, data, config) =>{
    let response;
    try{
        response = config ? await api.post(path, data, config) : await api.post(path, data);
        return response;
    }catch(err){
        if(process.env.REACT_APP_VERBOSE_ERROR === "true"){
            verboseErrorOutput(err);
        }else{
            simpleErrorOutput(err);
        }
        return err.response;
    }
}

const del = async (path, params, config) =>{
    let response;
    try{
        if(params){
            const fullUrl = path + '?' + new URLSearchParams(params).toString();
            response = await api.delete(fullUrl, config);   
        }else{
            response = await api.delete(path, config)
        }
        return response;
    }catch(err){
        if(process.env.REACT_APP_VERBOSE_ERROR === "true"){
            verboseErrorOutput(err);
        }else{
            simpleErrorOutput(err);
        }
        return err.response;
    }
}

const put = async (path, data, config) =>{
    let response;
    try{
        response = config ? await api.put(path, data, config) : await api.put(path, data);
        return response;
    }catch(err){
        if(process.env.REACT_APP_VERBOSE_ERROR === "true"){
            verboseErrorOutput(err);
        }else{
            simpleErrorOutput(err);
        }
        return err.response;
    }
}

export default {
    get, post, del, put
}