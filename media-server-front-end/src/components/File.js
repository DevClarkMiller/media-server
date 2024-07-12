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
    const isImage = useMemo(() => (
        file?.mimetype?.split('/')[0] === "image"
    ), [file?.mimetype]);

    const displayName = useMemo(() =>( (file?.og_name?.length < 25) ? file?.og_name : file?.og_name.substring(0, 25) + "..." ), [file]);

    const isSquare = useMemo(() => (itemView==="square"), [itemView]);

    //State
    const [hovering, setHovering] = useState(false);

    
    return(
        <FileDetailContext.Provider value={{hovering, displayName, file, checkOpacity, downloadFile}}>
            <div className={`w-64 ${isSquare ? "h-64" : "h-10"}`} onClick={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
                <BoxWrapper className={`container flex items-center justify-center content-start fileTile!bg-appleGray shadow-md !p-2 text-center font-semibold size-full ${isSquare&&"flex-col"}`}>
                    {isSquare? 
                        <SquareFile />
                    :
                        <TileFile />
                    }
                    
                    {isImage&&isSquare&&
                        <img className="w-3/4" src="https://upload.wikimedia.org/wikipedia/commons/6/6e/Golde33443.jpg" alt={file.og_name}></img>}
                </BoxWrapper>
            </div>
        </FileDetailContext.Provider>
    );
}

export default File;