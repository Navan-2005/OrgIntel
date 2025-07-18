import { useState } from 'react'
import reactLogo from './assets/react.svg'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import viteLogo from '/vite.svg'
import './App.css'
import Pdf from './Pages/Pdf'
import Sample from './components/Sample'
import ChatHistoryPage from './Pages/ChatHistoryPage.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='' element={<Pdf/>}/>
        <Route path='/sample' element={<Sample/>}/>
        <Route path='/chat-history' element={<ChatHistoryPage/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
