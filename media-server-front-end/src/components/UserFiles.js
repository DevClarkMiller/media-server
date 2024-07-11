import { useContext, useEffect } from "react";

//Context
import { FileContext } from "../App";

//Components
import BoxWrapper from '../mill-comps/components/BoxWrapper';
import File from "./File";

const UserFiles = () =>{
    //Context
    const { renderedFiles, setRendererdFiles, itemView } = useContext(FileContext);

    //Func is placed up here for limited rendering
    const checkOpacity = (element, setClass) =>{
        const computedStyle = window.getComputedStyle(element);
        const opacityValue = computedStyle.getPropertyValue('opacity');
        if(opacityValue === "0"){
            setClass("max-h-0 max-w-0 select-none hover:cursor-default");
        }else if(opacityValue === "1"){
            setClass("");
        }
    }

    return(
        <div className="userFiles flex flex-wrap items-start content-start justify-center gap-3">
            {renderedFiles&&
                renderedFiles.map((file) =>(
                    <File checkOpacity={checkOpacity} key={file.og_name} itemView={itemView} file={file}/>
                ))
            }
        </div>
    );
}

export default UserFiles;