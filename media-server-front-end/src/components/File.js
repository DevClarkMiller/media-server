import { useState, useMemo, createContext } from "react";

//Components
import BoxWrapper from "../mill-comps/components/BoxWrapper";
import TileFile from "./FileTypes/TileFile";
import SquareFile from "./FileTypes/SquareFile";

//Icons

//Functions 

export const FileDetailContext = createContext();

const File = ({checkOpacity, file, itemView, downloadFile}) =>{
    //Memo calcs
    const fileType = useMemo(() => (
        file?.mimetype?.split('/')[0]
    ), [file?.mimetype]);

    const isImage = useMemo(() => (
        fileType === "image"
    ), [fileType]);

    const isVideo = useMemo(() => (
        fileType === "video"
    ), [fileType]);

    const isAudio = useMemo(() => (
        fileType === "audio"
    ), [fileType]);

    const fileURL = useMemo(() => { //This is needed in order to be able to preview the files
        const baseUrl = 'http://localhost:3650/media/download';
        const queryParams = new URLSearchParams({
            email: 'clarkmillermail@gmail.com',
            filename: file.og_name,
            isCompressed: true
        });

        return `${baseUrl}?${queryParams.toString()}`;  //The url in which the file can be accessed
    }, [file?.og_name]);

    const displayName = useMemo(() =>( (file?.og_name?.length < 25) ? file?.og_name : file?.og_name.substring(0, 25) + "..." ), [file]);

    const isSquare = useMemo(() => (itemView==="square"), [itemView]);

    //State
    const [hovering, setHovering] = useState(false);
    
    return(
        <FileDetailContext.Provider value={{hovering, displayName, file, checkOpacity, downloadFile}}>
            <div className={`w-64 ${isSquare ? "h-64" : "h-10"}`} onClick={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
                <BoxWrapper className={`container flex items-center justify-center content-start fileTile !bg-appleGray shadow-md !p-2 text-center font-semibold size-full ${isSquare&&(isImage||isVideo||isAudio)&&"flex-col justify-between"}`}>
                    {isSquare? 
                        <SquareFile />
                    :
                        <TileFile />
                    }
                    
                    {isImage&&isSquare&&
                        <img className="size-full overflow-hidden" src={fileURL} alt={file.og_name}></img>}
                    {isVideo&&isSquare&&
                        <video className="size-full overflow-hidden" src={fileURL} muted controls="controls" width="600" height="300" alt={file.og_name}></video>}
                    {isAudio&&isSquare&&
                        <div className="size-full flex items-center justify-center flex-grow">
                            <audio className="w-full h-12 overflow-hidden" src={fileURL} controls />
                        </div>
                    }
                </BoxWrapper>
            </div>
        </FileDetailContext.Provider>
    );
}

export default File;