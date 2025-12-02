import {  Routes, Route, BrowserRouter } from 'react-router-dom'
import { Home,About,ProjectPage,Contact } from './pages'
import './App.css'


function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path ='/about-us' element={<About/>}/>
          <Route path ="/projects" element={<ProjectPage/>}/>
          <Route path ="/contact" element={<Contact/>}/>
        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
