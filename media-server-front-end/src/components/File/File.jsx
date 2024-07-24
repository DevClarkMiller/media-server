import { useState, useMemo, createContext, useRef, useCallback, useEffect, useContext } from "react";

//Components
import BoxWrapper from "../../mill-comps/components/BoxWrapper";
import LabelInput from "../utilities/LabelInput";
import FileControls from "./FileControls";
import FileHeader from "./FileHeader";

//Icons
import { IoCloudDownloadOutline, IoCloudDownload, IoTrashOutline, IoTrashSharp, IoCreateOutline, IoCreate } from "react-icons/io5";
import LoadingIcons from 'react-loading-icons'

export const FileDetailContext = createContext();

const File = ({file, itemView, downloadFile, deleteFile, renameFile, fetchFileURL}) =>{
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

    //State
    const [menuActive, setMenuActive] = useState(false);
    const [editing, setEditing] = useState(false);
    const [newFileName, setNewFileName] = useState(file?.og_name);
    const [downloadProgress, setDownloadProgress] = useState(null); //For the progress bar
    const [fileURL, setFileURL] = useState(null);

    const btnsShow = useMemo(() => menuActive && !editing, [menuActive, editing]);

    useEffect(() =>{ 
        if(isSquare && !fileURL) fetchFileURL(file, fileFormat, setFileURL); 
    }, [file?.og_name, fileFormat, isSquare]);

    //Adds listeners to the transitioned property for the text and button when the component renders
    // useEffect(() =>{ assignListeners(btnRef, textRef, setBtnClass, setTextClass); }, [btnRef, textRef]);

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
        <FileDetailContext.Provider value={{setMenuActive, menuActive, file, downloadFile, setDownloadProgress, deleteFile, editing, setEditing, newFileName, setNewFileName, onRename, onBlurInput}}>
            <div ref={containerRef} className={`nice-trans w-64 container file-container ${isSquare ? "h-64" : "h-10"} ${isSquare&&fileFormat?.hasContent&&"flex-col justify-between"}`} onClick={checkToSet} onMouseLeave={checkUnSet}>
                {!downloadProgress ?
                    <>
                        <div className={`nice-trans overflow-hidden h-10 w-full flex items-center justify-center`}>
                            <FileHeader onBlurInput={onBlurInput} textRef={textRef}/>
                            <FileControls btnRef={btnRef} btnsShow={btnsShow}/>
                        </div>
    
                        {fileFormat.isImage&&isSquare&&
                            <>{fileURL ?
                                <img className="size-full overflow-hidden" src={fileURL} alt={file.og_name}></img>
                                :
                                <LoadingIcons.TailSpin className="size-3/4 overflow-hidden" stroke="#000000" strokeOpacity={.75} speed={.75}/>
                            }</>
                        }
                        {fileFormat.isVideo&&isSquare&&
                            <>{fileURL ?
                                <div className="videoWrapper size-full flex items-center justify-center overflow-hidden">
                                    <video className="size-fit overflow-hidden" src={fileURL} muted controls="controls" title={file.og_name}></video>
                                </div>
                                :
                                <LoadingIcons.TailSpin className="size-3/4 overflow-hidden" stroke="#000000" strokeOpacity={.75} speed={.75}/>
                            }</>
                        }
                            
                        {fileFormat.isAudio&&isSquare&&
                            <>{fileURL ?
                                <div className="size-full flex items-center justify-center flex-grow">
                                    <audio className="w-full h-12 overflow-hidden" src={fileURL} controls />
                                </div>
                                :
                                <LoadingIcons.TailSpin className="size-3/4 overflow-hidden" stroke="#000000" strokeOpacity={.75} speed={.75}/>
                            }</>
                        }
                    </> :
                    <progress value={downloadProgress}/>
                }
            </div>
        </FileDetailContext.Provider>
    );
}

export default File;