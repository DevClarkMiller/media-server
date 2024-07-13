import { useContext, useEffect } from "react";

//Context
import { FileContext } from "../App";

//Components
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

    const downloadFile = async (filename, setDownloadState) =>{
        const trackDownloadProgress = (progressEvent) =>{
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setDownloadState(percentCompleted / 100);

            // This condition checks if the download is complete successfully
            if (percentCompleted === 100 && progressEvent.loaded === progressEvent.total) {
                console.log("Download complete!");
                setDownloadState(null); // Reset download state after completion
            } else if (progressEvent.loaded === 0 && progressEvent.total === 0) {
                setDownloadState(null); // Disables the download bar
            }
            //console.log(`Download progress: ${percentCompleted}%`);
        } 

        const options = {
            responseType: 'blob', // Set response type to blob for file download
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
            credentials: "include",
            onDownloadProgress: trackDownloadProgress,
        }

        const response = await fetchAll.get('/media/download', {
            email: "clarkmillermail@gmail.com",
            filename: filename
        }, options); 

        if(!response || response.status === 404) return;

        const file = response.data;

        console.log(file);
        if(!file) return;

        fileDownload(file, filename);

        setTimeout(() =>{
            setDownloadState(null); // Disables the download bar
            console.log('Download complete!');
        }, [250]);
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