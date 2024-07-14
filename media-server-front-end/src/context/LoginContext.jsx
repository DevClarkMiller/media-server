import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

//Functions
import fetchAll from "../functions/fetch";

//Context

export const LoginContext = createContext();

export const LoginProvider = ({children}) =>{
    const navigate = useNavigate();
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
            return navigate('/login');
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