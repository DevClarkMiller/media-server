import { useEffect, useContext, useRef, useState } from "react";

//Components 
import LabelInput from "../utilities/LabelInput";

//Icons
import { IoCloudDownloadOutline, IoCloudDownload, IoTrashOutline, IoTrashSharp, IoCreateOutline, IoCreate } from "react-icons/io5";

//Context
import { FileDetailContext } from "../File";

const FileName = ({textRef, hovering, textClass, displayName, editing}) =>{
    return(
        <>
            {!editing&&<p ref={textRef} className={`nice-trans hover:cursor-pointer max-one-line ${!hovering&& "max-max flex-grow"} ${hovering && "opacity-0"} ${textClass}`}>{displayName}</p>}
            {editing&&<LabelInput

            >Edit File Name</LabelInput>}
        </>
    );
}

const TileFile = () =>{
    const { hovering, displayName, file, checkOpacity, downloadFile, setDownloadProgress, deleteFile, assignListeners, editing, setEditing, newFileName, setNewFileName } = useContext(FileDetailContext);

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
            <FileName  displayName={displayName} hovering={hovering} textClass={textClass} textRef={textRef}/>
            <div ref={btnRef} className={`flex items-center gap-2`}>
                <button  onClick={() => downloadFile(file.og_name, setDownloadProgress)}><IoCloudDownloadOutline className={`nice-trans text-lg hover:cursor-pointer hover:text-appleLightBlue ${!hovering && "opacity-0 w-0"} ${btnClass}`} /></button>
                <button onClick={() => setEditing(true)}><IoCreateOutline className={`nice-trans text-lg hover:cursor-pointer hover:text-appleLightBlue ${!hovering && "opacity-0 w-0"} ${btnClass}`}/></button>
                <button onClick={() => deleteFile(file.og_name)} ><IoTrashOutline className={`nice-trans text-lg hover:cursor-pointer hover:text-red-500 ${!hovering && "opacity-0 w-0"} ${btnClass}`}/></button>
            </div>
        </>
    );
}

export default TileFile;