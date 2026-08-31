import { useMemo, useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

//Components
import NotFound from "../utilities/NotFound";
import LabelInput from "../utilities/LabelInput";

//Functions
import fetchAll from "../../functions/fetch";

//Context
import { LoginContext } from "../../context/LoginContext";

const ResetPassword = () =>{
    const navigate = useNavigate();
    const location = useLocation();

    const [newPassword, setNewPassword] = useState("");
    const [retypedNewPassword, setRetypedNewPassword] = useState("");


    const token = useMemo(() =>{
        const query = new URLSearchParams(location.search);
        return query.get('token');
    }, []);

    const onSubmit = async e =>{
        e.preventDefault();
        if(newPassword !== retypedNewPassword) return alert("Passwords don't match!");

        const response = await fetchAll.post('/account/forgot', {
            newPassword: newPassword,
            token: token
        }, 
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
            credentials: "include"
        });
        if(!response) return alert('Something went wrong while resetting your password!');

        if(response?.status > 204) return alert(response.data);
    }

    return(
        <>
            {token ?
            <form onSubmit={onSubmit} className="authenticateAccount size-full text-white col-flex-center justify-center gap-5">
                <h2 className="font-semibold text-xl text-center">To reset your password, please click the button below</h2>
                <LabelInput
                    required
                    type="password"
                    inputClassName="text-black p-1"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                >New Password</LabelInput>
                <LabelInput
                    required
                    type="password"
                    inputClassName="text-black p-1"
                    value={retypedNewPassword}
                    onChange={e => setRetypedNewPassword(e.target.value)}
                >Confirm New Password</LabelInput>
                <button 
                    type="submit"
                    className={`text-white round-button blue-button`}>
                Reset Password</button>
            </form> :
                <NotFound />
            }
        </>
    );
}

export default ResetPassword;