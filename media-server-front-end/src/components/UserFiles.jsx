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
    const { renderedFiles, setRenderedFiles, itemView, setFiles, files } = useContext(FileContext);

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

    const deleteFile = async filename =>{
        const response = await fetchAll.del("/media", {ogName: filename}, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
            credentials: "include",
        });
        console.log(response.status);
        if(!response || response?.status !== 200) return alert("Couldn't delete file");
        alert("File now deleted!");
        setFiles(files.filter((file) => file.og_name !== filename));
    }

    const renameFile = async (oldName, newName) =>{
        const response = await fetchAll.put("/media",{
            ogName: oldName,
            newName: newName
        },{
            withCredentials: true,
            credentials: "include",
        });

        if(!response || response?.status > 204 || !response?.data) return alert('Something went wrong when renaming your file!');

        //Change the old file details to the new info
        let filesCpy = [...files];
        const index = filesCpy.findIndex((file) => file.og_name === oldName);
        console.log(`FILE INDEX: ${index}`);
        console.log('OLD FILE: ');
        console.log(filesCpy[index]);
        filesCpy[index] = response.data;
        console.log('NEW FILE: ');
        console.log(filesCpy[index]);
        
        console.log(filesCpy);
        setFiles(filesCpy);
    }

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

    const assignListeners = (btnRef, textRef, setBtnClass, setTextClass) =>{
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
    }
    
    return(
        <div className="userFiles flex flex-wrap items-start content-start justify-center gap-3">
            {renderedFiles?.map((file) =>(
                <File 
                    checkOpacity={checkOpacity} 
                    key={file.og_name} 
                    downloadFile={downloadFile} 
                    deleteFile={deleteFile} 
                    renameFile={renameFile}
                    itemView={itemView} 
                    file={file}
                    assignListeners={assignListeners}
                />
            ))}
        </div>
    );
}

export default UserFiles;