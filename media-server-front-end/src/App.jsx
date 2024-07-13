import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {Routes, Route} from 'react-router-dom';

//Components
import Header from "./components/Header";
import Content from "./components/Content";
import Login from './components/account/Login';

//Functions
import fetchAll from './functions/fetch';

//Context
import {LoginContext} from './context/LoginContext';
import CreateAccount from './components/account/CreateAccount';

export const FileContext = createContext();

function App() {
  //Context
  const {loggedIn, setLoggedIn, account, setAccount, grabAccount} = useContext(LoginContext);

  //State
  const [files, setFiles] = useState([]);
  const [renderedFiles, setRendererdFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [itemView, setItemView] = useState("tile"); //Either tile or square

  useEffect(() => {grabAccount()}, []);

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
      const getFiles = async () =>{
          const response = await fetchAll.get('/media', null,
            {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true,
              credentials: "include"
          });
          if(response){
            setFiles(response.data);
          }
      }
      getFiles();
  }, []);

  return (
    <div className="App flex flex-col items-center bg-deepBlack min-h-screen gap-5 pt-5">
      <FileContext.Provider value={{files, setFiles, search, setSearch, renderedFiles, setRendererdFiles, itemView, setItemView}}>
        <Header />
        <Routes>
          <Route path='/' element={<Content />}/>
          <Route path='login' element={<Login />}/>
          <Route path='createAccount' element={<CreateAccount/>} />
        </Routes>
      </FileContext.Provider>
    </div>
  );
}

export default App;
