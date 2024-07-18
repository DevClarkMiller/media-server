import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

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

  //Enums
  const SortEnum = Object.freeze({
    name: "og_name",
    ext: "ext",
    fileSize: "file_size",
    mimetype: "mimetype"
  });

  const sortOptions = [
    {value: SortEnum.name, label: "By Name"}, 
    {value: SortEnum.ext, label: "By Ext"},
    {value: SortEnum.fileSize, label: "By Size"},
    {value: SortEnum.mimetype, label: "By Format"}
  ];

  //Context
  const {loggedIn, grabAccount} = useContext(LoginContext);

  //State
  const [files, setFiles] = useState([]);
  const [renderedFiles, setRendererdFiles] = useState([]);
  const [fileSort, setFileSort] = useState(SortEnum.name);
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

  //For tracking changes in the fileSort state
  useEffect(() =>{
    if(!fileSort) return;
    console.log(fileSort)
    let sortedFiles;
    if(fileSort === "mimetype"){
      sortedFiles = [...files].sort((file1, file2) =>{
        const f1Mime = file1[fileSort].split('/')[0];
        const f2Mime = file2[fileSort].split('/')[0];
        console.log(f1Mime, f2Mime);

        return (f1Mime !== f2Mime) ? 
          f1Mime.localeCompare(f2Mime) : file1.og_name.localeCompare(file2.og_name);
      });
      console.log(sortedFiles);
    }else{
      sortedFiles = [...files].sort((file1, file2) =>(
        (typeof file1[fileSort] ==="string" && typeof file2[fileSort]==="string" ) ?
        file1[fileSort].localeCompare(file2[fileSort]) 
        :
        file1[fileSort] - file2[fileSort]
      ));
    }
    
    setRendererdFiles(sortedFiles);
  }, [files, fileSort]);

  return (
    <div className="App flex flex-col items-center bg-deepBlack h-screen min-h-screen gap-5 pt-5">
      <FileContext.Provider value={{files, setFiles, search, setSearch, renderedFiles, setRendererdFiles, itemView, setItemView, fileSort, setFileSort, sortOptions}}>
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
