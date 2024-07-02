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

module.exports = () =>{
    const get = async (path, params) =>{
        try{
            if(params){
                const fullUrl = path + '?' + new URLSearchParams(params).toString();
                const response = await backendApi.get(fullUrl);   
            }else{
                const response = await backendApi.get(path);
            }
        }catch(err){
            verboseErrorOutput(err);
        }
        finally { return response;}
    }

    return {get};
}