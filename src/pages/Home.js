import { useEffect } from 'react'

import Profile from '../components/Profile'
import Playlists from '../components/Playlists'
import Login from '../components/Login'

function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

const Home = ({ setPlaylistIds, code, setCode }) => {
  const params = getHashParams()
  useEffect(() => {
    setCode(params.access_token)
  },[params.access_token, setCode])
  if (code) {
    return (
      <div className="page">
        <h2>Home Page</h2>
        <Profile code={code} />
        <Playlists code={code} setPlaylistIds={setPlaylistIds} />
      </div>
    );
  } else {
    return (
      <div className="page">
        <h2>Please Login</h2>
        <Login />
      </div>
    )
  }
}

export default Home;
