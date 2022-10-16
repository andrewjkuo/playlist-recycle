const Login = () => {
  var scope = 'playlist-modify-private playlist-modify-public playlist-read-private user-read-email user-read-private';
  var redirectUri = 'http://localhost:3000/';
  var clientId = 'f8b6de26f95e4276b9e4274008549c1e';

  var authorizeURL = 'https://accounts.spotify.com/authorize';
  authorizeURL += '?response_type=token';
  authorizeURL += '&client_id=' + encodeURIComponent(clientId);
  authorizeURL += '&scope=' + encodeURIComponent(scope);
  authorizeURL += '&redirect_uri=' + encodeURIComponent(redirectUri);
  // authorizeURL += '&state=' + encodeURIComponent(state);

  return (
    <div>
      <a href={ authorizeURL }>
        <div className="btn btn-primary">
          Connect To Spotify
        </div>
      </a>
    </div>
  )
}

export default Login;