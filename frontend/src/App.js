import './App.css'

import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import { Toaster } from 'react-hot-toast';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/Home';

function App() {
  return (
  <Router>
    <div className="App">
        <Toaster position='top-center' />
        <Header />
        <div className='container'>
            <Routes>
               <Route path='/' element={<Home />} />
            </Routes>
        </div>
          
        <Footer />
    </div>
  </Router>
  );
}

export default App;
