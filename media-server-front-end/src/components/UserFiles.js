import { useContext, useEffect } from "react";

//Context
import { FileContext } from "../App";

//Components
import BoxWrapper from '../mill-comps/components/BoxWrapper';
import File from "./File";

//Functions
import fetchAll from '../functions/fetch';
import fileDownload from 'js-file-download';

const UserFiles = () =>{
    //Context
    const { renderedFiles, itemView } = useContext(FileContext);

    //Func is placed up here for limited rendering
    const checkOpacity = (element, setClass) =>{
        const computedStyle = window.getComputedStyle(element);
        const opacityValue = computedStyle.getPropertyValue('opacity');
        if(opacityValue === "0"){
            setClass("size-0 max-h-0 max-w-0 select-none hover:cursor-default");
        }else if(opacityValue === "1"){
            setClass("");
        }
    }

    const downloadFile = async (filename) =>{
        const options = {
            responseType: 'blob', // Set response type to blob for file download
          }

        const response = await fetchAll.get('/media/download', {
            email: "clarkmillermail@gmail.com",
            filename: filename
        }, options); 

        const file = response.data;
        if(!file) return;

        fileDownload(file, filename);
    }
    
    return(
        <div className="userFiles flex flex-wrap items-start content-start justify-center gap-3">
            {renderedFiles&&
                renderedFiles.map((file) =>(
                    <File checkOpacity={checkOpacity} key={file.og_name} downloadFile={downloadFile} itemView={itemView} file={file}/>
                ))
            }
        </div>
    );
}

export default UserFiles;