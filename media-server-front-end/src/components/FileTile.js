import { useState, useEffect, useRef, useMemo } from "react";

//Components
import BoxWrapper from "../mill-comps/components/BoxWrapper";

//Icons
import { IoCloudDownloadOutline, IoCloudDownload  } from "react-icons/io5";

import supportedImgs from '../config/supported-imgs.json';

const FileTile = ({checkOpacity, file, itemView}) =>{
    const isImage = useMemo(() => (supportedImgs.includes(file?.ext)), [supportedImgs, file?.og_name]);

    const displayName = useMemo(() =>( (file?.og_name?.length < 25) ? file?.og_name : file?.og_name.substring(0, 25) + "..." ), [file]);

    const isSquare = useMemo(() => (itemView==="square"), [itemView]);

    //State
    const [hovering, setHovering] = useState(false);
    const [textClass, setTextClass] = useState("");
    const [btnClass, setBtnClass] = useState("");
 
    //Refs
    const textRef = useRef();
    const btnRef = useRef();

    
    //Adds listeners to the transitioned property for the text and button when the component renders
    useEffect(() =>{
        if(btnRef.current && textRef.current){
            checkOpacity(btnRef.current, setBtnClass);
            checkOpacity(textRef.current, setTextClass);
            btnRef.current.addEventListener('transitionend', (e) =>{
                if (e.propertyName === 'opacity') {
                    checkOpacity(btnRef.current, setBtnClass);
                }
            });

            textRef.current.addEventListener('transitionend', (e) =>{
                if (e.propertyName === 'opacity') {
                    checkOpacity(textRef.current, setTextClass);
                }
            });
        }
    }, [btnRef, textRef]);

    return(
        <div className={`w-64 ${isSquare ? "h-64" : "h-10"}`} onClick={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
            <BoxWrapper className={`flex items-center justify-center content-start fileTile!bg-appleGray shadow-md !p-2 text-center font-semibold size-full ${isSquare ? "flex-col" : ""}`}>
                {isSquare?
                    <div className="h-10 w-full flex items-center justify-center">
                        <p ref={textRef} className={`tran-trans-opac duration-300 hover:cursor-pointer ${!hovering&& "!max-h-max !max-w-max"} ${hovering && "opacity-0"} ${textClass}`}>{displayName}</p>
                        <div ref={btnRef}>
                            <a href="https://clarkmiller.ca/publicFiles/resume.pdf"  download={file.og_name}>
                                <IoCloudDownloadOutline className={`tran-trans-opac duration-300 hover:cursor-pointer hover:text-appleLightBlue ${!hovering && "opacity-0 "} ${btnClass}`} />
                            </a>
                        </div>
                    </div>
                :
                    <>
                        <p ref={textRef} className={`tran-trans-opac duration-300 hover:cursor-pointer ${!hovering&& "!max-h-max !max-w-max"} ${hovering && "opacity-0"} ${textClass}`}>{displayName}</p>
                        <div ref={btnRef}>
                            <a href="https://clarkmiller.ca/publicFiles/resume.pdf"  download={file.og_name}>
                                <IoCloudDownloadOutline className={`tran-trans-opac hover:cursor-pointer hover:text-appleLightBlue ${!hovering && "opacity-0 "} ${btnClass}`} />
                                </a>
                        </div>
                    </>
                }
                
                {isImage&&isSquare&&
                    <img className="w-3/4" src="https://upload.wikimedia.org/wikipedia/commons/6/6e/Golde33443.jpg" alt={file.og_name}></img>}
            </BoxWrapper>
        </div>
    );
}

export default FileTile;