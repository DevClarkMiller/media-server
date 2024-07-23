import { useState } from "react";

//Components
import LabelInput from "../utilities/LabelInput";

//Functions
import fetchAll from "../../functions/fetch";


const RequestPasswordReset = () =>{
    const [email, setEmail] = useState("");

    const onSubmit = async e =>{
        e.preventDefault();

        const response = fetchAll.get('/account/forgot', {
            email: email
        },
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
            credentials: "include"
        });
    }

    return(
        <form onSubmit={onSubmit} className="authenticateAccount size-full text-white col-flex-center justify-center gap-5">
            <h2 className="font-semibold text-xl text-center">To reset your password, enter your email below</h2>
            <LabelInput
                required
                inputClassName="text-black p-1"
                value={email}
                onChange={e => setEmail(e.target.value)}
            >
                Email
            </LabelInput>
            <button 
                type="submit"
                className={`text-white round-button blue-button`}>
            Email Reset Request</button>
        </form>
    );
}

export default RequestPasswordReset;