import { useEffect, useContext, useRef, useState } from "react";

//Icons
import { IoCloudDownloadOutline, IoCloudDownload  } from "react-icons/io5";

//Context
import { FileDetailContext } from "../File";

const TileFile = () =>{
    const { hovering, displayName, file, checkOpacity } = useContext(FileDetailContext);

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
        <>
            <p ref={textRef} className={`nice-trans hover:cursor-pointer ${!hovering&& "!max-h-max !max-w-max"} ${hovering && "opacity-0"} ${textClass}`}>{displayName}</p>
            <a className="nice-trans" ref={btnRef} href="https://clarkmiller.ca/publicFiles/resume.pdf"  download={file.og_name}>
                <IoCloudDownloadOutline className={`nice-trans text-lg hover:cursor-pointer hover:text-appleLightBlue ${!hovering && "opacity-0 "} ${btnClass}`} />
            </a>
        </>
    );
}

export default TileFile;