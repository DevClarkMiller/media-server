import { useEffect, useContext, useRef, useState, useCallback } from "react";

//Icons
import { IoCloudDownloadOutline, IoCloudDownload  } from "react-icons/io5";

//Context
import { FileDetailContext } from "../File";

const SquareFile = () =>{
    const { hovering, displayName, file, checkOpacity, downloadFile } = useContext(FileDetailContext);

    //State
    const [textClass, setTextClass] = useState("");
    const [btnClass, setBtnClass] = useState("");

    //Refs
    const btnRef = useRef();
    const textRef = useRef();

    //Adds listeners to the transitioned property for the text and button when the component renders
    useEffect(() =>{
        const btnElem = btnRef.current;
        const textElem = textRef.current;

        if(!btnElem || !textElem) return;

        checkOpacity(btnElem, setBtnClass);
        checkOpacity(textElem, setTextClass);

        btnElem.addEventListener('transitionend', (e) =>{
            if (e.propertyName === 'opacity') checkOpacity(btnElem, setBtnClass);
        });

        textElem.addEventListener('transitionend', (e) =>{
            if (e.propertyName === 'opacity') checkOpacity(textElem, setTextClass);
        });
    }, [btnRef, textRef]);

    return(
        <div className="h-10 w-full flex items-center justify-center">
            <p ref={textRef} className={`nice-trans hover:cursor-pointer ${!hovering&& "!max-h-max !max-w-max flex-grow"} ${hovering && "opacity-0"} ${textClass}`}>{displayName}</p>
            <button ref={btnRef} onClick={() => downloadFile(file.og_name)}><IoCloudDownloadOutline className={`nice-trans text-lg hover:cursor-pointer hover:text-appleLightBlue ${!hovering && "opacity-0 "} ${btnClass}`} /></button>
        </div>
    );
}

export default SquareFile;