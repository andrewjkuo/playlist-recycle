import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import { useState } from 'react'
import './App.css';
import Home from './pages/Home'
import Editor from './pages/Editor'
import Error from './pages/Error'

function App() {
  const [playlistIds, setPlaylistIds] = useState([])
  const [code, setCode] = useState()

  return (
    <div className="app_container">
      <a href="/">
        <div className="hdr_container">
          <img src="spotify_header_new.png" alt="Spotify Playlist Recycling Plant" className="hdr_img"></img>
        </div>
      </a>
      <div className="main_app">
        <Router>
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
            <Route path="*" element={<Error />}/>
          </Routes>
        </Router>
      </div>
      <div className="footer">
        <p>
          Created by &thinsp;
          <b><a href="https://www.dr00bot.com" target="_blank" rel="noreferrer">dr00bot</a></b>
        </p>
        <a href="https://www.buymeacoffee.com/dr00bot" target="_blank" rel="noreferrer">
          <img id="bmac" src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" ></img>
        </a>
      </div>
    </div>
  );
}

export default App;
