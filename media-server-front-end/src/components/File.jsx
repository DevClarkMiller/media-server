import { useState, useMemo, createContext, useRef, useCallback, useEffect, useContext } from "react";

//Components
import BoxWrapper from "../mill-comps/components/BoxWrapper";
import LabelInput from "./utilities/LabelInput";

//Icons
import { IoCloudDownloadOutline, IoCloudDownload, IoTrashOutline, IoTrashSharp, IoCreateOutline, IoCreate } from "react-icons/io5";

//Functions 

export const FileDetailContext = createContext();

const FileHeader = ({textRef, textClass, filename}) =>{
    //Context
    const {editing, hovering, onRename, onBlurInput, setNewFileName, newFileName} = useContext(FileDetailContext);

    const shouldHide = useMemo(() => hovering || editing,[hovering, editing]);
    useEffect(() =>console.log(`HOVERING: ${hovering}, EDITING: ${editing}`), [hovering, editing]);
    
    return(
        <>
            {<p ref={textRef} className={`nice-trans hover:cursor-pointer max-one-line opacity-100 ${!shouldHide&& "max-max flex-grow"} ${shouldHide && "!opacity-0"} ${textClass}`}>{filename}</p>}
            {editing&&
                <form onSubmit={onRename}>
                    <LabelInput 
                    onBlur={onBlurInput}
                    labelClassName="hidden"
                    inputClassName="text-center border rounded"
                    id={`edit${filename}`}
                    name={filename}
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
            <button  onClick={() => downloadFile(file.og_name, setDownloadProgress)}><IoCloudDownloadOutline className={`nice-trans text-lg hover:cursor-pointer hover:text-appleLightBlue ${!btnsShow && "opacity-0 w-0"} ${btnClass}`} /></button>
            <button onClick={() => setEditing(true)}><IoCreateOutline className={`nice-trans text-lg hover:cursor-pointer hover:text-appleLightBlue ${!btnsShow && "opacity-0 w-0"} ${btnClass}`}/></button>
            <button onClick={() => deleteFile(file.og_name)} ><IoTrashOutline className={`nice-trans text-lg hover:cursor-pointer hover:text-red-500 ${!btnsShow && "opacity-0 w-0"} ${btnClass}`}/></button>
        </div>
    );
}

const File = ({checkOpacity, file, itemView, downloadFile, deleteFile, assignListeners, renameFile}) =>{
    //Memo calcs
    const fileType = useMemo(() => (
        file?.mimetype?.split('/')[0]
    ), [file?.mimetype]);

    const isImage = useMemo(() => (
        fileType === "image"
    ), [fileType]);

    const isVideo = useMemo(() => (
        fileType === "video"
    ), [fileType]);

    const isAudio = useMemo(() => (
        fileType === "audio"
    ), [fileType]);

    const fileURL = useMemo(() => { //This is needed in order to be able to preview the files
        const baseUrl = 'http://drive.clarkmiller.ca/api/media/download';
        const options = {
            withCredentials: true,
            credentials: "include"
        };

        const queryParams = new URLSearchParams({
            filename: file.og_name,
            isCompressed: true
        }, options);

        return `${baseUrl}?${queryParams.toString()}`;  //The url in which the file can be accessed
    }, [file?.og_name]);

    const isSquare = useMemo(() => (itemView==="square"), [itemView]);

    //State
    const [hovering, setHovering] = useState(false);
    const [editing, setEditing] = useState(false);
    const [newFileName, setNewFileName] = useState(file?.og_name);
    const [downloadProgress, setDownloadProgress] = useState(null); //For the progress bar
    const [textClass, setTextClass] = useState("");
    const [btnClass, setBtnClass] = useState("");

    const btnsShow = useMemo(() => hovering && !editing, [hovering, editing]);

    //Refs
    const containerRef = useRef();
    const btnRef = useRef();
    const textRef = useRef();
    
    //Adds listeners to the transitioned property for the text and button when the component renders
    useEffect(() =>{ assignListeners(btnRef, textRef, setBtnClass, setTextClass); }, [btnRef, textRef]);

    const checkToSet = () =>{
        if(editing) return;
        setHovering(true);
    }

    const checkUnSet = () =>{
        if(editing) return;
        setHovering(false);
    }

    //Memoized functions

    const onRename = useCallback((e) =>{
        e.preventDefault();
        renameFile(file?.og_name, newFileName);
    }, [file, newFileName]);

    const onBlurInput = () =>{
        console.log('Input blurred');
        setNewFileName(file?.og_name);
        setEditing(false);
        setHovering(false);
    }

    return(
        <FileDetailContext.Provider value={{hovering, file, checkOpacity, downloadFile, setDownloadProgress, deleteFile, assignListeners, editing, setEditing, newFileName, setNewFileName, onRename, onBlurInput}}>
            <div ref={containerRef} className={`nice-trans w-64 ${isSquare ? "h-64" : "h-10"}`} onClick={checkToSet} onMouseLeave={checkUnSet}>
                <BoxWrapper  className={`container flex items-center justify-center content-start fileTile !bg-appleGray shadow-md !p-2 text-center font-semibold size-full ${isSquare&&(isImage||isVideo||isAudio)&&"flex-col justify-between"}`}>
                    {!downloadProgress ?
                        <>
                            <div className={`h-10 w-full flex items-center justify-center`}>
                                <FileHeader filename={file.og_name} onBlurInput={onBlurInput} textClass={textClass} textRef={textRef}/>
                                <FileControls btnRef={btnRef} btnClass={btnClass} btnsShow={btnsShow}/>
                            </div>
     
                            {isImage&&isSquare&&
                                <img className="size-full overflow-hidden" src={fileURL} alt={file.og_name}></img>}
                            {isVideo&&isSquare&&
                                <video className="size-full overflow-hidden" src={fileURL} muted controls="controls" width="600" height="300" alt={file.og_name}></video>}
                            {isAudio&&isSquare&&
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