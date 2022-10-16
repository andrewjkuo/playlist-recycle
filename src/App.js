import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom'
import { useState } from 'react'
import './App.css';
import Home from './pages/Home'
import Editor from './pages/Editor'

const padding = {
  padding: 5
}

function App() {
  const [playlistIds, setPlaylistIds] = useState([])
  const [code, setCode] = useState()

  return (
    <div className="app_container">
      <div className="main_app">
        <Router>
          <div>
            <Link style={padding} to="/">home</Link>
            <Link style={padding} to="/editor">editor</Link>
          </div>
          <Routes>
            <Route path="/" element={<Home
              setPlaylistIds={setPlaylistIds}
              code={code}
              setCode={setCode}
              className="page"
            />} />
            <Route path="/editor" element={<Editor
              playlistIds={playlistIds}
              code={code}
              className="page"
            />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
