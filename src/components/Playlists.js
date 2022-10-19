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

  if (playlists.length > 0) {
    return (
      <div>
        <p>
          Select all of the playlists that you would like to recycle.
        </p>
        <button onClick={() => setPlaylists(playlists.map(p => ({...p, ...{include: true}})))}>Select All</button>
        <button onClick={() => setPlaylists(playlists.map(p => ({...p, ...{include: false}})))} id="deselect-btn">Deselect All</button>
        <div className="playlist_container">
          <table>
            <thead>
              <tr>
                <th></th>
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
        </div>
        <button
          onClick={showIncluded}
          disabled={playlists.filter(playlist => playlist.include).length === 0}
        >
          Import Tracks
        </button>
      </div>
    )
  } else {
    return (
      <button onClick={() => getPlaylists(code, setPlaylists)}>Get Playlists</button>
    )
  }
}

export default Playlists;
