import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {Routes, Route, useNavigate, useLocation} from 'react-router-dom';

//Components
import Header from "./components/Header";
import Content from "./components/Content";
import Login from './components/account/Login';
import NotFound from './components/utilities/NotFound';
import AuthenticateAccount from './components/AuthenticateAccount';

//Functions
import fetchAll from './functions/fetch';

//Context
import {LoginContext} from './context/LoginContext';
import CreateAccount from './components/account/CreateAccount';

export const FileContext = createContext();

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  //Context
  const {loggedIn, setLoggedIn, account, setAccount, grabAccount} = useContext(LoginContext);

  //State
  const [files, setFiles] = useState([]);
  const [renderedFiles, setRendererdFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [itemView, setItemView] = useState("tile"); //Either tile or square

  useEffect(() => { if(!loggedIn) grabAccount() }, [location]);

  useEffect(() =>{
    const filteredFiles = files.filter((file) => {
      const fileName = file.og_name.toLowerCase().replace(/[\s-]+/g, '');
      const searchTerm = search.toLowerCase().replace(/[\s-]+/g, '');
      return fileName.includes(searchTerm);
    });
    setRendererdFiles(filteredFiles)
  }, [files, search]);

  //Once user becomes logged in, retrieve all of their files
  useEffect(() =>{
    if(!loggedIn) return;
    console.log("Now going to get files!");
    const getFiles = async () =>{
        const response = await fetchAll.get('/media', null,
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
            credentials: "include"
        });

        if(!response || response.status !== 200) {
          //Navs you to the login page
          navigate('/login');
        }  
        
        setFiles(response.data);
    }
    getFiles();
  }, [loggedIn]);

  return (
    <div className="App flex flex-col items-center bg-deepBlack h-screen min-h-screen gap-5 pt-5">
      <FileContext.Provider value={{files, setFiles, search, setSearch, renderedFiles, setRendererdFiles, itemView, setItemView}}>
        <Header />
        <Routes>
          <Route path='/' element={<Content />}/>
          <Route path='login' element={<Login />}/>
          <Route path='createAccount' element={<CreateAccount/>} />
          <Route path='authenticate' element={<AuthenticateAccount />} />
          <Route path='*' element={<NotFound />}/>
        </Routes>
      </FileContext.Provider>
    </div>
  );
}

export default App;
