import { useContext, useEffect, useMemo } from "react";

import { GoPerson, GoPersonFill } from "react-icons/go";
import { IoExitOutline } from "react-icons/io5";

//Functions
import fetchAll from "../functions/fetch";

//Context
import { LoginContext } from "../context/LoginContext";

const Header = () =>{
    //Context
    const { account, loggedIn } = useContext(LoginContext);

    //Memos
    const username = useMemo(() =>(
        account?.email?.split("@")[0]
    ), [account, loggedIn]);

    const logout = async() =>{
        const options = {
            withCredentials: true,
            credentials: "include"
        };

        const response = await fetchAll.del('/account/signout', options);
        window.location.reload();
    }

    return(
        <header className="w-full px-5 flex justify-center">
            <h1 className="text-3xl font-semibold text-white flex-grow text-center">Discrete File Drive</h1> 
            
            {loggedIn&&<div className="logoutBar flex items-center gap-2">
                <h3 className="text-white">{username}</h3>
                <button onClick={logout} className="nice-trans text-white text-lg hover:text-appleBlue"><IoExitOutline  /></button>
            </div>}
        </header>
    );
}

export default Header;