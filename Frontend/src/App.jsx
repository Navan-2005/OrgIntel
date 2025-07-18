import { useState } from 'react'
import reactLogo from './assets/react.svg'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import viteLogo from '/vite.svg'
import './App.css'
import Pdf from './Pages/Pdf'
import store from './redux/store'
import {Provider} from 'react-redux'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Provider store={store}>
      <BrowserRouter>
      <Routes>
        <Route path='' element={<Pdf/>}/>
      </Routes>
      </BrowserRouter>
      </Provider>
    </div>
  )
}

export default App
