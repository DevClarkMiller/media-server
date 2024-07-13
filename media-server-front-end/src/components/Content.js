//Components
import UserFiles from "./UserFiles";
import Menu from "./Menu";

const Content = () =>{
    return(
        <main className="w-full p-5 flex flex-col items-center gap-5">
            <Menu />
            <UserFiles />
        </main>
    );
}

export default Content;