const Login = () => {
  var redirectUri = 'https://www.playlistrecycle.com/'
  if (process.env.NODE_ENV !== 'production') {
    redirectUri = 'http://localhost:3000/'
  }

  var scope = 'playlist-modify-private playlist-modify-public playlist-read-private user-read-email user-read-private'
  var clientId = 'f8b6de26f95e4276b9e4274008549c1e'
  var authorizeURL = 'https://accounts.spotify.com/authorize'
  authorizeURL += '?response_type=token'
  authorizeURL += '&client_id=' + encodeURIComponent(clientId)
  authorizeURL += '&scope=' + encodeURIComponent(scope)
  authorizeURL += '&redirect_uri=' + encodeURIComponent(redirectUri)


  const navigateConnect = () => {
    window.location.replace(authorizeURL)
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