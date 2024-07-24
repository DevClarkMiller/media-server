import { useContext, useEffect, useMemo } from "react";

//Components
import LabelInput from "../utilities/LabelInput";

//Context
import { FileDetailContext } from "./File";

const FileHeader = ({textRef}) =>{
    //Context
    const {editing, menuActive, onRename, onBlurInput, setNewFileName, newFileName, file} = useContext(FileDetailContext);

    const shouldHide = useMemo(() => menuActive || editing, [menuActive, editing]);

    useEffect(() => console.log(menuActive), [menuActive]);
    useEffect(() => console.log(shouldHide), [shouldHide]); 
    
    return(
        <>
            {!editing&&<p ref={textRef} className={`nice-trans w-full hover:cursor-pointer max-one-line ${shouldHide ? "file-header-hide" : "file-header-visible"}`}>{file?.og_name}</p>}
            {editing&&
                <form onSubmit={onRename}>
                    <LabelInput 
                    onBlur={onBlurInput}
                    labelClassName="hidden"
                    inputClassName="text-center border rounded"
                    spanClassName="file-header-visible"
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

export default FileHeader;