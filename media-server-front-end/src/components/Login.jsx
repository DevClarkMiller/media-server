import { useContext, useState } from "react";

//Components
import LabelInput from "./utilities/LabelInput";

//Functions
import fetchAll from "../functions/fetch";

//Context
import { LoginContext } from "../context/LoginContext";

const Login = () =>{
    //Context
    const {setAccount} = useContext(LoginContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onLogin = async e =>{
        e.preventDefault();

        const accountData = await fetchAll.post("/", {
            email: email,
            password: password
        });
    }

    return(
        <form className="size-full col-flex-center gap-5" onSubmit={onLogin}>
            <div className="loginFields w-3/4 text-white col-flex-center gap-5">
                <LabelInput 
                    id="email"
                    inputClassName="round-input-black"
                    labelClassName="text-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                >Email</LabelInput>

                <LabelInput 
                    id="password"
                    inputClassName="round-input-black"
                    labelClassName="text-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type="password"
                >Password</LabelInput>
            </div>

            <button className="text-white round-button">Login</button>
        </form>
    );
}

export default Login;