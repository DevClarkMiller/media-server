import {Routes, Route} from 'react-router-dom';
import { useEffect, useState } from "react";
import fetchAll from './functions/fetch';
import { createContext } from 'react';

//Components
import Header from "./components/Header";
import Content from "./components/Content";

export const FileContext = createContext();

function App() {
  const [files, setFiles] = useState([]);
  const [renderedFiles, setRendererdFiles] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() =>{
    const filteredFiles = files.filter((file) => {
      const fileName = file.og_name.toLowerCase().replace(/[\s-]+/g, '');
      const searchTerm = search.toLowerCase().replace(/[\s-]+/g, '');
      return fileName.includes(searchTerm);
    });
    setRendererdFiles(filteredFiles)
  }, [files, search]);

    //On the first render, retrieve all of the users files
    useEffect(() =>{
        const getFiles = async () =>{
            const response = await fetchAll.get('/media', {email: "clarkmillermail@gmail.com"});
            if(response){
              setFiles(response.data);
            }
        }
        getFiles();
    }, []);

  return (
    <div className="App flex flex-col items-center bg-deepBlack min-h-screen gap-5 pt-5">
      <FileContext.Provider value={{files, setFiles, search, setSearch, renderedFiles, setRendererdFiles}}>
        <Header />
        <Routes>
          <Route path='/' element={<Content />}/>
        </Routes>
      </FileContext.Provider>
    </div>
  );
}

export default App;
