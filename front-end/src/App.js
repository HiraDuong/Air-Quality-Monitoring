
import './App.css';
import { Routes,Route } from 'react-router-dom';
import Test from './components/test';
import Home from './pages/Home';
import Details from './pages/Details';

function App() {
  return (
    <div className="App">
      <>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path ="/details" element={<Details/>} />
        <Route path="/test" element={<Test/>} />
      </Routes>
      </>
    </div>
  );
}

export default App;
