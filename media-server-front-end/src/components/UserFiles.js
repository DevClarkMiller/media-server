import { useContext, useEffect } from "react";

//Context
import { FileContext } from "../App";

//Components
import BoxWrapper from '../mill-comps/components/BoxWrapper';
import FileTile from "./FileTile";

const UserFiles = () =>{
    const {renderedFiles, setRendererdFiles} = useContext(FileContext);

    return(
        <div className="userFiles flex flex-wrap justify-center">
            {renderedFiles&&
                renderedFiles.map((file) =>(
                    <FileTile key={file.og_name} file={file}/>
                ))
            }
        </div>
    );
}

export default UserFiles;