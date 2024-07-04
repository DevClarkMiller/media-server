import { useEffect, useRef, useState, useContext } from "react";
import fetchAll from '../functions/fetch';

//Components

//Context
import { FileContext } from "../App";

//Icons
import { CiCirclePlus, CiSearch } from "react-icons/ci";

const SearchBar = ({search, setSearch}) =>{
    return(
        <div className="searchDiv flex items-center flex-grow bg-appleGray rounded-2xl">
            <CiSearch className="text-4xl text-deepBlack"/>
            <label htmlFor="search"></label>
            <input className="w-full bg-transparent hover:outline-none focus:outline-none" placeholder="Search Files" id="search" value={search} onChange={(e) => setSearch(e.target.value)}/>
        </div>
    );
}

const Menu = () =>{
    const {files, setFiles, search, setSearch} = useContext(FileContext);
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
        <div className="menu w-full flex gap-5">
            <form ref={formRef} onSubmit={uploadFile}>
                <input onChange={handleChange} className="hidden" ref={fileRef} type="file" />
                <CiCirclePlus onClick={selectFile} className="text-white text-4xl transition-colors duration-300 hover:text-appleLightBlue hover:cursor-pointer"/>
            </form>
            <SearchBar search={search} setSearch={setSearch} />            
        </div>
    );
}

export default Menu;