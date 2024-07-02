import { useContext, useEffect } from "react";

//Context
import { FileContext } from "../App";

//Components
import BoxWrapper from '../mill-comps/components/BoxWrapper';

const UserFiles = () =>{
    const {files, setFiles} = useContext(FileContext);

    useEffect(() =>{
        console.log(files);
    }, [files]);

    return(
        <div className="userFiles flex flex-wrap justify-center">
            {files&&
                files.map((file) =>(
                    <BoxWrapper key={file.og_name} className="!bg-appleGray shadow-md !p-2">
                        <p>{file.og_name}</p>
                    </BoxWrapper>
                ))
            }
        </div>
    );
}

export default UserFiles;