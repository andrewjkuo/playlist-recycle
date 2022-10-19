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
        <h1>Playlists</h1>
        <Profile code={code} />
        <Playlists code={code} setPlaylistIds={setPlaylistIds} />
      </div>
    );
  } else {
    return (
      <div className="page">
        <h1>Home</h1>
        <h2>About</h2>
        <hr></hr>
        <p>
          Don't send your old playlists to landfill! The <b>Spotify
          Playlist Recycling Plant</b> is a sustainable solution that
          combs through your music library and generates new
          intelligent playlists based on a few user inputs.
        </p>
        <p>
          If you're anything like me, you've got thousands of songs
          floating around in a bunch of Spotify playlists with titles
          like "<i><b>~~GUD S0NGZ 2k18~~</b></i>". You know there are some forgotten
          gems in all that mess but it would take ages to find them...
        </p>
        <p>   
          At the heart of this tool is a custom algorithm that
          uses Spotify's <b>5000+</b> unique genres to identify
          similar artists. E.g. If you want to listen to some
          tracks that sound like The Stooges and The Ramones, just
          plug in those artists, adjust a few settings and your
          playlist will be ready before you can say "The KKK Took My
          Baby Away".
        </p>
        <p>
          <b>Please Note</b>: This tool will only use tracks from your existing
          playlists and <b>DOES NOT</b> suggest new music. If this is
          functionality you are looking for, I would suggest using
          Spotify's recommendation algorithm. It's pretty good!
        </p>
        <h2>Instructions</h2>
        <hr></hr>
        <ol>
          <li>
            <b>Select your pre-loved playlists: </b>
            You can choose any playlist you follow or have created.
          </li>
          <li>
            <b>Customise your settings: </b>
            Adjust the time period, artists, genres etc.
          </li>
          <li>
            <b>Profit: </b>
            Export your shiny new playlist directly to Spotify.
          </li>
        </ol>
        <p>
          It's pretty simple. You'll work it out.
        </p>
        <h2>Login</h2>
        <hr></hr>
        <p>Please connect to Spotify to continue...</p>
        <Login />
      </div>
    )
  }
}

export default Home;
