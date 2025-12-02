import {  Routes, Route, BrowserRouter } from 'react-router-dom'
import { Home,About } from './pages'
import './App.css'


function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path ='/about-us' element={<About/>}/>
        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
