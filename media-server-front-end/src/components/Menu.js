import { useEffect, useRef, useState, useContext } from "react";
import fetchAll from '../functions/fetch';

//Components

//Context
import { FileContext } from "../App";

//Icons
import { CiCirclePlus } from "react-icons/ci";

const Menu = () =>{
    const {files, setFiles} = useContext(FileContext);
    const [newFile, setNewFile] = useState();

    const fileRef = useRef();
    const formRef = useRef();

    const uploadFile = async (e) =>{
        e.preventDefault();
        if(newFile){
            const formData = new FormData();
            formData.append('file', newFile);
            formData.append('email', 'clarkmillermail@gmail.com');

            const config = {
                headers: {
                    'content-type': 'multipart/form-data',
                },
            };
            const response = await fetchAll.post('/media', formData, config);
            setFiles([...files, response.data]); //Adds new file to the files state
            setNewFile(null);
        }
    }   

    useEffect(() =>{
        if(newFile){
            formRef.current.requestSubmit();
        }
    }, [newFile]);

    const selectFile = () =>{
        fileRef.current.click();
    }

    const handleChange = (e) =>{
        setNewFile(e.target.files[0]);
    }

    return(
        <div className="menu w-full flex">
            <form ref={formRef} onSubmit={uploadFile}>
                <input onChange={handleChange} className="hidden" ref={fileRef} type="file" />
                <CiCirclePlus onClick={selectFile} className="text-white text-4xl transition-colors duration-300 hover:text-appleLightBlue hover:cursor-pointer"/>
            </form>
        </div>
    );
}

export default Menu;