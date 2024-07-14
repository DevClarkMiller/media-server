import { useContext, useState, useReducer } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";

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
    const {setAccount, setLoggedIn} = useContext(LoginContext);

    //State

    //Reducers
    const [newAccount, dispatchNewAccount] = useReducer(accountReducer, INITIAL_STATE);

    const { ref: emailRef, inView: emailInView} = useInView({
        threshold: 0
    });

    const { ref: passwordRef, inView: passwordInView} = useInView({
        threshold: 0
    });

    const { ref: firstnameRef, inView: firstnameInView} = useInView({
        threshold: 0
    });

    const { ref: lastnameRef, inView: lastnameInView} = useInView({
        threshold: 0
    });

    const { ref: btnLinkRef, inView: btnLinkInView, entry} = useInView({
        threshold: 0
    });


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
        setLoggedIn(true);

        dispatchNewAccount({
            type:"RESET_FIELDS"
        }); //Resets the fields
        navigate('/');
    }

    const revealed = "opacity-100 translate-x-0 blur-none";

    return(
        <form className="size-full col-flex-center gap-5 justify-center" onSubmit={onCreateAccount}>
            <div className="loginFields w-3/4 text-white col-flex-center gap-5">
                <LabelInput 
                    ref={emailRef}
                    id="email"
                    spanClassName={`slow-trans off-to-side ${emailInView&& revealed}`}
                    inputClassName="round-input-black"
                    labelClassName="text-xl"
                    value={newAccount.email}
                    onChange={handleChange}
                    required
                    type="email"
                    name="email"
                >Email</LabelInput>

                <LabelInput 
                    ref={passwordRef}
                    id="password"
                    spanClassName={`slow-trans off-to-side-right ${passwordInView&& revealed}`}
                    inputClassName="round-input-black"
                    labelClassName="text-xl"
                    value={newAccount.password}
                    onChange={handleChange}
                    required
                    type="password"
                    name="password"
                >Password</LabelInput>

                <LabelInput 
                    ref={firstnameRef}
                    id="firstname"
                    spanClassName={`slow-trans off-to-side ${firstnameInView&& revealed}`}
                    inputClassName="round-input-black"
                    labelClassName="text-xl"
                    value={newAccount.firstname}
                    onChange={handleChange}
                    required
                    name="firstname"
                >First Name</LabelInput>

                <LabelInput 
                    ref={lastnameRef}
                    id="lastname"
                    spanClassName={`slow-trans off-to-side-right ${lastnameInView&& revealed}`}
                    inputClassName="round-input-black"
                    labelClassName="text-xl"
                    value={newAccount.lastname}
                    onChange={handleChange}
                    required
                    name="lastname"
                >Last Name</LabelInput>
            </div>
            
            <div ref={btnLinkRef} className={`btnNLink col-flex-center gap-2 off-to-side slow-trans ${btnLinkInView&& revealed}`}>
                <button 
                type="submit"
                className={`text-white round-button blue-button`}>
                Create Account</button>
                <Link to="/login" className="link text-xl">Login</Link>
            </div>
        </form>
    );
}

export default CreateAccount;