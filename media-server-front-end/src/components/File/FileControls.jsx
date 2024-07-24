import { useContext } from "react";

//Components
import { IoCloudDownloadOutline, IoCloudDownload, IoTrashOutline, IoTrashSharp, IoCreateOutline, IoCreate } from "react-icons/io5";

//Context
import { FileDetailContext } from "./File";

const FileControls = ({btnRef, btnsShow }) =>{
    //Context
    const {setMenuActive, file, downloadFile, setDownloadProgress, setEditing, deleteFile} = useContext(FileDetailContext);

    return(
        <div ref={btnRef} className={`file-controls flex items-center gap-2 nice-trans ${btnsShow ? "file-menu-visible" : "file-menu-hide"}`}>
            <button disabled={btnsShow ? false : true} className="hover:text-appleLightBlue text-lg" onClick={() => setEditing(true)}><IoCreateOutline/></button>
            <button disabled={btnsShow ? false : true} className="hover:text-appleLightBlue text-lg"  onClick={() => downloadFile(file.og_name, setDownloadProgress, setMenuActive)}><IoCloudDownloadOutline /></button>
            <button disabled={btnsShow ? false : true} className="hover:text-red-500 text-lg" onClick={() => deleteFile(file.og_name)} ><IoTrashOutline/></button>
        </div>
    );
}

export default FileControls;