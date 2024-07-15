import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

//Functions
import fetchAll from "../functions/fetch";

const AuthenticateAccount = () =>{
    const location = useLocation();
    const token = useMemo(() =>{
        const query = new URLSearchParams(location.search);
        return query.get('token');
    }, []);

    const onSubmit = e =>{
        e.preventDefault();
    }

    return(
        <form onSubmit={onSubmit} className="authenticateAccount size-full text-white col-flex-center justify-center gap-5">
            <h2 className="font-semibold text-xl">To authenticate your account, please click the button below</h2>
            <button 
                type="submit"
                className={`text-white round-button blue-button`}>
            Authenticate Account</button>
        </form>
    );
}

export default AuthenticateAccount;