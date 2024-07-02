import { useEffect, useState } from "react";

import fetch from "../functions/fetch";

//Components

const UserFiles = () =>{
    const [files, setFiles] = useState([]);

    //On the first render, retrieve all of the users files
    useEffect(() =>{
        const getFiles = () =>{
            const data = fetch.get('/media', {
                
            });
        }
    }, []);

    return(
        <div className="userFiles">

        </div>
    );
}

export default UserFiles;