import { useEffect, useContext, useRef, useState, useMemo } from "react";

//Components 
import LabelInput from "../utilities/LabelInput";

//Icons
import { IoCloudDownloadOutline, IoCloudDownload, IoTrashOutline, IoTrashSharp, IoCreateOutline, IoCreate } from "react-icons/io5";

//Context
import { FileDetailContext } from "../File";

const FileName = ({textRef, hovering, textClass, displayName, editing, setEditing, newFileName, setNewFileName, onRename, onBlurInput}) =>{
    return(
        <>
            {!editing&&<p ref={textRef} className={`nice-trans hover:cursor-pointer max-one-line ${!hovering&& "max-max flex-grow"} ${hovering && "opacity-0"} ${textClass}`}>{displayName}</p>}
            {editing&&
                <form onSubmit={onRename}>
                    <LabelInput 
                    onBlur={onBlurInput}
                    labelClassName="hidden"
                    inputClassName="text-center border rounded"
                    id={`edit${displayName}`}
                    name={displayName}
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                >Edit File Name</LabelInput>
                </form>
            }
        </>
    );
}

const TileFile = () =>{
    const { hovering, displayName, file, checkOpacity, downloadFile, setDownloadProgress, deleteFile, assignListeners, editing, setEditing, newFileName, setNewFileName, onRename, onBlurInput } = useContext(FileDetailContext);

    //Memoization
    const btnsShow = useMemo(() => hovering && !editing, [hovering, editing]);

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
            <FileName onRename={onRename} newFileName={newFileName} setNewFileName={setNewFileName} editing={editing} displayName={displayName} hovering={hovering} textClass={textClass} textRef={textRef} setEditing={setEditing} onBlurInput={onBlurInput}/>
            <div ref={btnRef} className={`flex items-center gap-2`}>
                <button  onClick={() => downloadFile(file.og_name, setDownloadProgress)}><IoCloudDownloadOutline className={`nice-trans text-lg hover:cursor-pointer hover:text-appleLightBlue ${!btnsShow && "opacity-0 w-0"} ${btnClass}`} /></button>
                <button onClick={() => setEditing(true)}><IoCreateOutline className={`nice-trans text-lg hover:cursor-pointer hover:text-appleLightBlue ${!btnsShow && "opacity-0 w-0"} ${btnClass}`}/></button>
                <button onClick={() => deleteFile(file.og_name)} ><IoTrashOutline className={`nice-trans text-lg hover:cursor-pointer hover:text-red-500 ${!btnsShow && "opacity-0 w-0"} ${btnClass}`}/></button>
            </div>
        </>
    );
}

export default TileFile;