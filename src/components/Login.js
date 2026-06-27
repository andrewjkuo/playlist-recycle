import { startSpotifyLogin } from '../services/auth'

const Login = () => {
  const navigateConnect = () => {
    startSpotifyLogin()
  }

  return (
    <div>
      <button onClick={navigateConnect}>
        Connect To Spotify
      </button>
    </div>
  )
}

export default Login;
