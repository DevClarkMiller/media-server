import { useContext, useEffect } from "react";

//Context
import { FileContext } from "../App";

//Components
import BoxWrapper from '../mill-comps/components/BoxWrapper';
import FileTile from "./FileTile";

const UserFiles = () =>{
    const {renderedFiles, setRendererdFiles} = useContext(FileContext);

    //Func is placed up here for limited rendering
    const checkOpacity = (element, setClass) =>{
        const computedStyle = window.getComputedStyle(element);
        const opacityValue = computedStyle.getPropertyValue('opacity');
        if(opacityValue === "0"){
            setClass("max-h-0 max-w-0  select-none");
        }else if(opacityValue === "1"){
            setClass("");
        }
    }

    return(
        <div className="userFiles flex flex-wrap justify-center">
            {renderedFiles&&
                renderedFiles.map((file) =>(
                    <FileTile checkOpacity={checkOpacity} key={file.og_name} file={file}/>
                ))
            }
        </div>
    );
}

export default UserFiles;