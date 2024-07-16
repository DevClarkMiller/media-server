import { useRef, useEffect } from "react";

//Components
import UserFiles from "./UserFiles";
import Menu from "./Menu";

const Content = () =>{
    //Refs
    const mainRef = useRef();

    //On page load, scroll to the top
    useEffect(() =>{mainRef.current.scrollTo(0, 0)}, []);

    return(
        <main ref={mainRef} className="w-full p-5 flex flex-col items-center gap-5">
            <Menu />
            <UserFiles />
        </main>
    );
}

export default Content;