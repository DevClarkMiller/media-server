import { useContext, useEffect, useCallback } from "react";

//Context
import { FileContext } from "../App";

//Components
import File from "./File/File";

//Functions
import fetchAll from '../functions/fetch';
import fileDownload from 'js-file-download';

const UserFiles = () =>{
    //Context
    const { renderedFiles, setRenderedFiles, itemView, setFiles, files, createdURLS, setCreatedURLS, handleAddURL, handleRemoveURL } = useContext(FileContext);

    const downloadFile = async (filename, setDownloadState, setMenuActive) =>{
        const trackDownloadProgress = (progressEvent) =>{
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setDownloadState(percentCompleted / 100);

            // This condition checks if the download is complete successfully
            if (percentCompleted === 100 && progressEvent.loaded === progressEvent.total) {
                console.log("Download complete!");
                setDownloadState(null); // Reset download state after completion
                setMenuActive(false);   //Disables menu so that the filename displays again
            } else if (progressEvent.loaded === 0 && progressEvent.total === 0) {
                setDownloadState(null); // Disables the download bar
                setMenuActive(false);
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
            setMenuActive(false);
            console.log('Download complete!');
        }, [250]);
    }

    const deleteFile = async filename =>{
        const response = await fetchAll.del("/media", {ogName: filename}, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
            credentials: "include",
        });
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
        filesCpy[index] = response.data;
        setFiles(filesCpy);
    }

    const fetchFileURL = async (file, fileFormat, setFileURL) =>{
        if(!file || !fileFormat) return;
        if(fileFormat.hasContent){
            //1. Checks to see if this url has already been created 
            let urlObj = createdURLS.find((urlItem) => urlItem.filename === file.og_name);
            let url = urlObj?.url;
            setFileURL(url);
            if(!url){
                const options = {
                    responseType: 'blob', // Set response type to blob for file download
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                    credentials: "include",
                }
    
                const response = await fetchAll.get("/media/download", {
                    filename: file?.og_name,
                    isCompressed: true
                }, options);
                if(response.status !== 200) return;
                const blob = response.data;
                url = window.URL.createObjectURL(blob); 
                setFileURL(url);

                const urlObj ={
                    filename: file?.og_name,
                    url: url
                }

                handleAddURL(urlObj);
            }
        }
    }
    
    return(
        <div className="userFiles size-full flex-grow flex flex-wrap items-start content-start justify-start gap-3">
            {renderedFiles?.map((file) =>(
                <File 
                    key={file.og_name} 
                    downloadFile={downloadFile} 
                    deleteFile={deleteFile} 
                    renameFile={renameFile}
                    itemView={itemView} 
                    file={file}
                    fetchFileURL={fetchFileURL}
                />
            ))}
        </div>
    );
}

export default UserFiles;