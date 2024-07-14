import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";

//Components
import LabelInput from "../utilities/LabelInput";

//Functions
import fetchAll from "../../functions/fetch";

//Context
import { LoginContext } from "../../context/LoginContext";

const Login = () =>{
    const navigate = useNavigate();

    const { ref: emailRef, inView: emailInView} = useInView({
        threshold: 0
    });

    const { ref: passwordRef, inView: passwordInView} = useInView({
        threshold: 0
    });

    const { ref: btnLinkRef, inView: btnLinkInView, entry} = useInView({
        threshold: 0
    });

    //Context
    const {account, setAccount, setLoggedIn} = useContext(LoginContext);

    //State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onLogin = async e =>{
        e.preventDefault();

        const response = await fetchAll.post("/account", {
            email: email,
            password: password
        },
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
            credentials: "include"
        });

        if(!response?.data || response.status !== 200) return alert('Email or password was incorrect!');
        setAccount(response?.data);
        setLoggedIn(true);
        setEmail("");
        setPassword("");
        navigate('/');
    }

    const revealed = "opacity-100 translate-x-0 blur-none";

    return(
        <form className="size-full col-flex-center justify-center gap-5" onSubmit={onLogin}>
            <div className="loginFields w-3/4 text-white col-flex-center gap-5">
                <LabelInput 
                    ref={emailRef}
                    id="email"
                    spanClassName={`slow-trans off-to-side ${emailInView&& revealed}`}
                    inputClassName="round-input-black"
                    labelClassName="text-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                >Email</LabelInput>

                <LabelInput 
                    ref={passwordRef}
                    id="password"
                    spanClassName={`slow-trans off-to-side-right ${passwordInView&& revealed}`}
                    inputClassName="round-input-black"
                    labelClassName="text-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type="password"
                >Password</LabelInput>
            </div>

            <div ref={btnLinkRef} className={`btnNLink col-flex-center gap-2 off-to-side slow-trans ${btnLinkInView&& revealed}`}>
                <button 
                className={`text-white round-button blue-button`}>
                    Login</button>
                <Link to="/createAccount" className="link text-xl">Create Account</Link>
            </div>
        </form>
    );
}

export default Login;