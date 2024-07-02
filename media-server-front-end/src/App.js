import {Routes, Route} from 'react-router-dom';

//Components
import Header from "./components/Header";
import Content from "./components/Content";

function App() {
  return (
    <div className="App flex flex-col items-center justify-center">
      <Header />
      <Routes>
        <Route path='/' element={<Content />}/>
      </Routes>
    </div>
  );
}

export default App;
