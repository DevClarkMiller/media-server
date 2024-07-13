import { createContext, useState } from "react";

//Functions
import fetchAll from "../functions/fetch";

//Context
export const LoginContext = createContext();

export const LoginProvider = ({children}) =>{
    //State
    const [loggedIn, setLoggedIn] = useState(false);
    const [account, setAccount] = useState(null);

    const grabAccount = async () =>{
        const accountData = await fetchAll.get("/account", null, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
            credentials: "include"
        });

        if(!accountData?.data) return;
        setAccount(accountData?.data.account);
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