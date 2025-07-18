import { useState } from 'react'
import reactLogo from './assets/react.svg'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import viteLogo from '/vite.svg'
import './App.css'
import Pdf from './Pages/Pdf'
import Sample from './components/Sample'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='' element={<Pdf/>}/>
        <Route path='/sample' element={<Sample/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
