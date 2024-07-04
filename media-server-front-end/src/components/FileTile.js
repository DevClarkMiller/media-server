import { useState, useEffect, useRef } from "react";

//Components
import BoxWrapper from "../mill-comps/components/BoxWrapper";

//Icons
import { IoCloudDownloadOutline, IoCloudDownload  } from "react-icons/io5";

const FileTile = ({file}) =>{
    const [displayName, setDisplayName] = useState("");
    const [hovering, setHovering] = useState(false);
    const [textClass, setTextClass] = useState("");
    const [btnClass, setBtnClass] = useState("");
 
    const textRef = useRef();
    const btnRef = useRef();

    useEffect(() =>{
        if(file){
            setDisplayName(
                (file.og_name.length < 25) ? file.og_name.length : file.og_name.substring(0, 25) + "..."
            );
        }
    }, [file]);

    const checkOpacity = (element, setClass) =>{
        const computedStyle = window.getComputedStyle(element);
        const opacityValue = computedStyle.getPropertyValue('opacity');
        if(opacityValue === "0"){
            setClass("max-h-0 max-w-0 select-none");
        }else if(opacityValue === "1"){
            setClass("");
        }
    }

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
        <div onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
            <BoxWrapper className="flex items-center justify-center w-64 h-10 fileTile!bg-appleGray shadow-md !p-2 text-center">
                <p ref={textRef} className={`tran-trans-opac duration-300 ${!hovering&& "!max-h-max !max-w-max"} ${hovering && "opacity-0"} ${textClass}`}>{displayName}</p>
                <div ref={btnRef}>
                    <a href="https://clarkmiller.ca/publicFiles/resume.pdf" target="_blank" download={file.og_name}>
                        <IoCloudDownloadOutline className={`tran-trans-opac duration-300 hover:cursor-pointer hover:text-appleLightBlue ${!hovering && "opacity-0 "} ${btnClass}`} />
                        </a>
                    </div>
            </BoxWrapper>
        </div>
    );
}

export default FileTile;