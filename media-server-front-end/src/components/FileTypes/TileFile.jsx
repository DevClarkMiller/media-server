import { useEffect, useContext, useRef, useState } from "react";

//Icons
import { IoCloudDownloadOutline, IoCloudDownload, IoTrashOutline, IoTrashSharp } from "react-icons/io5";

//Context
import { FileDetailContext } from "../File";

const TileFile = () =>{
    const { hovering, displayName, file, checkOpacity, downloadFile, setDownloadProgress, deleteFile, assignListeners } = useContext(FileDetailContext);

    //State
    const [textClass, setTextClass] = useState("");
    const [btnClass, setBtnClass] = useState("");

    //Refs
    const btnRef = useRef();
    const textRef = useRef();

    //Adds listeners to the transitioned property for the text and button when the component renders
    useEffect(() =>{ assignListeners(btnRef, textRef, setBtnClass, setTextClass); }, [btnRef, textRef]);
    
    return(
        <>
            <p ref={textRef} className={`nice-trans hover:cursor-pointer max-one-line ${!hovering&& "max-max flex-grow"} ${hovering && "opacity-0"} ${textClass}`}>{displayName}</p>
            <div ref={btnRef} className="flex items-center">
                <button  onClick={() => downloadFile(file.og_name, setDownloadProgress)}><IoCloudDownloadOutline className={`nice-trans text-lg hover:cursor-pointer hover:text-appleLightBlue ${!hovering && "opacity-0 "} ${btnClass}`} /></button>
                <button onClick={() => deleteFile(file.og_name)} ><IoTrashOutline className={`nice-trans text-lg hover:cursor-pointer hover:text-red-500 ${!hovering && "opacity-0 max-w-0"} ${btnClass}`}/></button>
            </div>
        </>
    );
}

export default TileFile;