import { useEffect, useRef, useState, useContext, useMemo } from "react";

//Components
import Select from 'react-select';

//Context
import { FileContext } from "../App";
import { LoginContext } from "../context/LoginContext";

//Functions
import fetchAll from '../functions/fetch';

//Icons
import { CiCirclePlus, CiSearch } from "react-icons/ci";
import { RxHamburgerMenu, RxGrid  } from "react-icons/rx";


const ViewOptions = ({itemView, setItemView}) =>{
    const {sortOptions, fileSort, setFileSort} = useContext(FileContext);

    const isSquare = useMemo(() => (itemView === "square"), [itemView]);

    const selectedClass = "text-appleBlue hover:text-appleLighterBlue";

    return(
        <div className="viewOptions w-3/4 col-flex-center gap-3 justify-between lg:flex-row">
            <Select 
                placeholder="Sort By"
                options={sortOptions} 
                onChange={(option) => setFileSort(option.value)}
            />
            <div className="changeItemView flex items-center text-white text-3xl gap-3">
                <h3 className="hidden lg:inline-block">Display Type</h3>
                <button onClick={() => setItemView("tile")} className={`tileBtn nice-trans ${!isSquare ? selectedClass: "hover:text-appleLightBlue"}`}><RxHamburgerMenu /></button>
                <button onClick={() => setItemView("square")} className={`squareBtn nice-trans hover:text-appleLightBlue ${isSquare ? selectedClass : "hover:text-appleLightBlue"}`}><RxGrid /></button>
            </div>
        </div>
    );
}

const SearchBar = ({search, setSearch}) =>{
    return(
        <div className="searchDiv flex items-center flex-grow bg-appleGray rounded-2xl">
            <CiSearch className="text-4xl text-deepBlack"/>
            <label htmlFor="search"></label>
            <input className="w-full bg-transparent hover:outline-none focus:outline-none" name="search" placeholder="Search Files" id="search" value={search} onChange={(e) => setSearch(e.target.value)}/>
        </div>
    );
}

const Menu = () =>{
    //Context
    const {files, setFiles, search, setSearch, itemView, setItemView} = useContext(FileContext);
    const {account} = useContext(LoginContext);

    //State
    const [newFile, setNewFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(null);

    //Refs
    const fileRef = useRef();
    const formRef = useRef();

    const onUploadProgress = progressEvent =>{
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(percentCompleted);
        setUploadProgress(percentCompleted / 100);

        // This condition checks if the download is complete successfully
        if (percentCompleted === 100 && progressEvent.loaded === progressEvent.total) {
            console.log("Upload complete!");
            setUploadProgress(null); // Reset download state after completion
        } else if (progressEvent.loaded === 0 && progressEvent.total === 0) {
            setUploadProgress(null); // Disables the download bar
        }
    }

    const uploadFile = async (e) =>{
        e.preventDefault();
        console.log(account);
        if(!newFile || !account?.email) return;
        try{
            const formData = new FormData();
            formData.append('file', newFile);

            const config = {
                headers: {
                    'content-type': 'multipart/form-data',
                },
                withCredentials: true,
                credentials: "include",
                onUploadProgress: onUploadProgress
            };
            const response = await fetchAll.post('/media', formData, config);
            if(response.status === 500) return alert("Unable to upload file");

            setFiles([...files, response.data]); //Adds new file to the files state
            setNewFile(null);

            setTimeout(() =>{
                setUploadProgress(null); // Disables the download bar
                console.log('Upload complete!');
            }, [250]);
        }catch(err){
            console.error(err);
            if(err?.response.status === 409){
                alert("File name conflict");
            }
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
        <div className="menu col-flex-center gap-3 w-3/4 lg:w-full">

            <div className="flex gap-5 w-full lg:w-3/4">
            <form ref={formRef} onSubmit={uploadFile}>
                <input onChange={handleChange} className="hidden" ref={fileRef} type="file" />
                <CiCirclePlus onClick={selectFile} className="text-white text-4xl transition-colors duration-300 hover:text-appleLightBlue hover:cursor-pointer"/>
            </form>
            {!uploadProgress?
                <SearchBar search={search} setSearch={setSearch} /> :
                <div className="w-full flex justify-center items-center"><progress  className="w-full" value={uploadProgress}/></div>   
            }
            </div>   
            <ViewOptions itemView={itemView} setItemView={setItemView} />
        </div>
    );
}

export default Menu;