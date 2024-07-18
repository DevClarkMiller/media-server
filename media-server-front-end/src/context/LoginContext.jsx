import { createContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

//Functions
import fetchAll from "../functions/fetch";

//Context

export const LoginContext = createContext();

export const LoginProvider = ({children}) =>{
    const navigate = useNavigate();
    const location = useLocation();
    //State
    const [loggedIn, setLoggedIn] = useState(false);
    const [account, setAccount] = useState(null);

    const grabAccount = async () =>{
        const response = await fetchAll.get("/account", null, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
            credentials: "include"
        });

        if(!response || response.status !== 200){
            const path = location.pathname;
            const shouldNav = !(path.includes("authenticate") || path.includes("login") || path.includes("createAccount"));
            console.log(shouldNav);
            if(location.pathname.includes)
            console.log(location.pathname);
            return (shouldNav) ?  navigate('/login') : null;
        }
        setAccount(response?.data?.account);
        setLoggedIn(true);
    }

    return(
        <LoginContext.Provider
            value={{loggedIn, setLoggedIn, account, setAccount, grabAccount}}
        >
            {children}
        </LoginContext.Provider>
    );
}