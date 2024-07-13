import { useContext, useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";

//Components
import LabelInput from "../utilities/LabelInput";

//Functions
import fetchAll from "../../functions/fetch";

//Reducers
import { accountReducer, INITIAL_STATE } from "./accountReducer";

//Context
import { LoginContext } from "../../context/LoginContext";

const CreateAccount = () =>{
    const navigate = useNavigate();

    //Context
    const {setAccount} = useContext(LoginContext);

    //State

    //Reducers
    const [newAccount, dispatchNewAccount] = useReducer(accountReducer, INITIAL_STATE);

    const handleChange = e =>{
        dispatchNewAccount({
            type:"CHANGE_INPUT", 
            payload:{ name: e.target.name, value:e.target.value }
        });
    }

    const onCreateAccount = async e =>{
        e.preventDefault();

        const response = await fetchAll.post("/account/create", {
            firstname: newAccount.firstname,
            lastname: newAccount.lastname,
            email: newAccount.email,
            password: newAccount.password
        },
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
            credentials: "include"
        });

        if(!response?.data) return alert('Unable to create account');
        setAccount(response.data.account);

        dispatchNewAccount({
            type:"RESET_FIELDS"
        }); //Resets the fields
        navigate('/');
    }
    return(
        <form className="size-full col-flex-center gap-5" onSubmit={onCreateAccount}>
            <div className="loginFields w-3/4 text-white col-flex-center gap-5">
                <LabelInput 
                    id="email"
                    inputClassName="round-input-black"
                    labelClassName="text-xl"
                    value={newAccount.email}
                    onChange={handleChange}
                    required
                    type="email"
                    name="email"
                >Email</LabelInput>

                <LabelInput 
                    id="password"
                    inputClassName="round-input-black"
                    labelClassName="text-xl"
                    value={newAccount.password}
                    onChange={handleChange}
                    required
                    type="password"
                    name="password"
                >Password</LabelInput>

                <LabelInput 
                    id="firstname"
                    inputClassName="round-input-black"
                    labelClassName="text-xl"
                    value={newAccount.firstname}
                    onChange={handleChange}
                    required
                    name="firstname"
                >First Name</LabelInput>

                <LabelInput 
                    id="lastname"
                    inputClassName="round-input-black"
                    labelClassName="text-xl"
                    value={newAccount.lastname}
                    onChange={handleChange}
                    required
                    name="lastname"
                >Last Name</LabelInput>
            </div>

            <button 
            className="text-white round-button blue-button">
                Login</button>
        </form>
    );
}

export default CreateAccount;