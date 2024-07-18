import { useState, useMemo, createContext, useRef, useCallback, useEffect, useContext } from "react";

//Components
import BoxWrapper from "../mill-comps/components/BoxWrapper";
import LabelInput from "./utilities/LabelInput";

//Icons
import { IoCloudDownloadOutline, IoCloudDownload, IoTrashOutline, IoTrashSharp, IoCreateOutline, IoCreate } from "react-icons/io5";

//Functions 
import fetchAll from "../functions/fetch";

export const FileDetailContext = createContext();

const FileHeader = ({textRef, textClass, filename}) =>{
    //Context
    const {editing, menuActive, onRename, onBlurInput, setNewFileName, newFileName, file} = useContext(FileDetailContext);

    const shouldHide = useMemo(() => menuActive || editing,[menuActive, editing]);
    
    return(
        <>
            {<p ref={textRef} className={`nice-trans hover:cursor-pointer max-one-line opacity-100 ${!shouldHide&& "max-max flex-grow"} ${shouldHide && "!opacity-0"} ${textClass}`}>{file?.og_name}</p>}
            {editing&&
                <form onSubmit={onRename}>
                    <LabelInput 
                    onBlur={onBlurInput}
                    labelClassName="hidden"
                    inputClassName="text-center border rounded"
                    id={`edit${file?.og_name}`}
                    name={file?.og_name}
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                >Edit File Name</LabelInput>
                </form>
            }
        </>
    );
}

const FileControls = ({btnRef, btnClass, btnsShow }) =>{
    //Context
    const {file, downloadFile, setDownloadProgress, setEditing, deleteFile} = useContext(FileDetailContext);

    return(
        <div ref={btnRef} className={`flex items-center gap-2`}>
            <button className="hover:text-appleLightBlue text-lg" onClick={() => setEditing(true)}><IoCreateOutline className={`nice-trans ${!btnsShow && "opacity-0 w-0"} ${btnClass}`}/></button>
            <button className="hover:text-appleLightBlue text-lg"  onClick={() => downloadFile(file.og_name, setDownloadProgress)}><IoCloudDownloadOutline className={`nice-trans ${!btnsShow && "opacity-0 w-0"} ${btnClass}`} /></button>
            <button className="hover:text-red-500 text-lg" onClick={() => deleteFile(file.og_name)} ><IoTrashOutline className={`nice-trans ${!btnsShow && "opacity-0 w-0"} ${btnClass}`}/></button>
        </div>
    );
}

const File = ({checkOpacity, file, itemView, downloadFile, deleteFile, assignListeners, renameFile}) =>{
    //Memo calcs
    const fileType = useMemo(() => (
        file?.mimetype?.split('/')[0]
    ), [file?.mimetype]);

    const fileFormat = useMemo(() =>({
        hasContent: fileType === "image" || fileType === "video" || fileType === "audio",
        isImage: fileType === "image",
        isVideo: fileType === "video",
        isAudio: fileType === "audio"
    }), [fileType]);

    const isSquare = useMemo(() => (itemView==="square"), [itemView]);

    //Refs
    const containerRef = useRef();
    const btnRef = useRef();
    const textRef = useRef();
    const mediaRef = useRef(); 

    //State
    const [menuActive, setMenuActive] = useState(false);
    const [editing, setEditing] = useState(false);
    const [newFileName, setNewFileName] = useState(file?.og_name);
    const [downloadProgress, setDownloadProgress] = useState(null); //For the progress bar
    const [textClass, setTextClass] = useState("");
    const [btnClass, setBtnClass] = useState("");
    const [fileURL, setFileURL] = useState(null);

    const btnsShow = useMemo(() => menuActive && !editing, [menuActive, editing]);

    const fetchFileURL = async () =>{
        if(!file || !fileFormat) return;
        if(fileFormat.isVideo){
            const options = {
                responseType: 'blob', // Set response type to blob for file download
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
                credentials: "include",
            }

            const response = await fetchAll.get("/media/download", {
                filename: file?.og_name,
                isCompressed: true
            }, options);
            if(response.status !== 200) return;
            const blob = response.data;
            const url = window.URL.createObjectURL(blob); 
            return setFileURL(url);
        }

        const baseUrl = `${process.env.REACT_APP_API_BASE}/media/download`;

        const options = {
            withCredentials: true,
            credentials: "include"
        };

        const queryParams = new URLSearchParams({
            filename: file?.og_name,
            isCompressed: true
        }, options);
        setFileURL(`${baseUrl}?${queryParams.toString()}`);  //The url in which the file can be accessed
    }

    useEffect(() =>{
        fetchFileURL();
    }, [file?.og_name, fileFormat]);

    //Adds listeners to the transitioned property for the text and button when the component renders
    useEffect(() =>{ assignListeners(btnRef, textRef, setBtnClass, setTextClass); }, [btnRef, textRef]);

    const checkToSet = () =>{
        if(editing) return;
        setMenuActive(true);
    }

    const checkUnSet = () =>{
        if(editing) return;
        setMenuActive(false);
    }

    //Memoized functions

    const onRename = useCallback((e) =>{
        e.preventDefault();
        renameFile(file?.og_name, newFileName);
    }, [file, newFileName]);

    const onBlurInput = () =>{
        console.log();
        setNewFileName(file?.og_name);
        setEditing(false);
        setMenuActive(false);
    }

    return(
        <FileDetailContext.Provider value={{menuActive, file, checkOpacity, downloadFile, setDownloadProgress, deleteFile, assignListeners, editing, setEditing, newFileName, setNewFileName, onRename, onBlurInput}}>
            <div ref={containerRef} className={`nice-trans w-64 ${isSquare ? "h-64" : "h-10"}`} onClick={checkToSet} onMouseLeave={checkUnSet}>
                <BoxWrapper className={`container file-container ${isSquare&&fileFormat.hasContent&&"flex-col justify-between"}`}>
                    {!downloadProgress ?
                        <>
                            <div className={`h-10 w-full flex items-center justify-center`}>
                                <FileHeader onBlurInput={onBlurInput} textClass={textClass} textRef={textRef}/>
                                <FileControls btnRef={btnRef} btnClass={btnClass} btnsShow={btnsShow}/>
                            </div>
     
                            {fileFormat.isImage&&isSquare&&fileURL&&
                                <img className="size-full overflow-hidden" src={fileURL} alt={file.og_name}></img>}

                            {fileFormat.isVideo&&isSquare&&fileURL&&
                                <video ref={mediaRef} className="size-full overflow-hidden" src={fileURL} muted controls="controls" width="600" height="300" alt={file.og_name}></video>}
                                
                            {fileFormat.isAudio&&isSquare&&fileURL&&
                                <div className="size-full flex items-center justify-center flex-grow">
                                    <audio className="w-full h-12 overflow-hidden" src={fileURL} controls />
                                </div>
                            }
                        </> :
                        <progress value={downloadProgress}/>
                    }
                </BoxWrapper>
            </div>
        </FileDetailContext.Provider>
    );
}

export default File;