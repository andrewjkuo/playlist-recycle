import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPlaylists } from '../services/spotify'

const Playlists = ({ code, setPlaylistIds }) => {
  const [playlists, setPlaylists] = useState([])

  const updateInclude = (id) => {
    const playlist = playlists.find(p => p.id === id)
    const changedPlaylist = { ...playlist, include: !playlist.include}
    setPlaylists(playlists.map(p => p.id !== id ? p: changedPlaylist))
  }
  const navigate = useNavigate()

  const showIncluded = () => {
    const outPlaylistIds = playlists
      .filter(p => p.include)
      .map(p => p.id)
    setPlaylistIds(outPlaylistIds)
    navigate('/editor')
  }
  
  // getPlaylists(code, setPlaylists)

  if (playlists.length > 0) {
    return (
      <div>
        <div>
          <table>
            <thead>
              <tr>
                <th>Include</th>
                <th>Name</th>
                <th>Description</th>
                <th>Tracks</th>
              </tr>
            </thead>
            <tbody>
              {playlists.map(playlist =>
                <tr key={playlist.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={playlist['include']}
                      onChange={() => updateInclude(playlist['id'])}
                    >
                    </input>
                  </td>
                  <td>{playlist['name']}</td>
                  <td>{playlist['description']}</td>
                  <td>{playlist['tracks']['total']}</td>
                </tr>
              )}
            </tbody>
          </table>
          <button onClick={showIncluded}>Import Tracks</button>
        </div>
      </div>
    )
  } else {
    return (
      <button onClick={() => getPlaylists(code, setPlaylists)}>Get Playlists</button>
    )
  }
}

export default Playlists;
