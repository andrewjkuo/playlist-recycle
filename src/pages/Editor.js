import { useEffect, useState } from 'react'
import { getTracks, createPlaylist } from '../services/spotify'
import Settings from '../components/Settings'
import Profile from '../components/Profile'
import Modal from '../components/Modal'

const Editor = ({ playlistIds, code }) => {
  const [tracks, setTracks] = useState([])
  const [artists, setArtists] = useState([])
  const [genres, setGenres] = useState([])
  const [outPlay, setOutPlay] = useState([])
  const [plTitle, setPlTitle] = useState('')
  const [plDesc, setPlDesc] = useState('')
  const [showModal, setShowModal] = useState(false)

  const resetPl = () => {
    setShowModal(false)
    setPlTitle('')
    setPlDesc('')
  }

  const beforeunload = (e) => {
    e.preventDefault()
    e.returnValue = true
  }

  useEffect(() => {
    window.addEventListener('beforeunload', beforeunload)
    return () => {
      window.removeEventListener('beforeunload', beforeunload)
    }
  })

  useEffect(() => {
    getTracks(code, playlistIds, setTracks, setArtists, setGenres)
  },[code,playlistIds])

  return (
    <div className="page">
      <h1>Editor</h1>
      <Profile code={code} />
      <Modal showModal={showModal} resetPl={resetPl}/>
      {genres.length === 0 &&
      <div>
        <div className="loading_container">
            <img className="loading" src="spotify_loading.png" alt="loading logo"></img>
        </div>
        <p className="loading_txt">Loading...</p>
      </div>
      }
      {genres.length > 0 && 
      <div>
        <div className="summ_container">
          <p>
            Successfully imported <b>{tracks.length}</b> tracks
            by <b>{artists.length}</b> artists
            from <b>{playlistIds.length}</b> playlists.
          </p>
        </div>
        <Settings
          tracks={tracks}
          artists={artists}
          genres={genres}
          setOutPlay={setOutPlay}
        />
      </div>
      }
      {outPlay.length > 0 &&
        <div>
          <h2>{"New Playlist - " + outPlay.length + " Tracks"}</h2>
          <div id="tracks_container">
            <table>
              <thead>
                <tr>
                  <th>Track</th>
                  <th>Artist</th>
                  <th>Album</th>
                  <th>Release Year</th>
                </tr>
              </thead>
              <tbody>
                {outPlay.map(track =>
                  <tr key={track.id}>
                    <td>{track.name}</td>
                    <td>{track.artists.map(itm => itm.name).join(', ')}</td>
                    <td>{track.album}</td>
                    <td>{track.release_date}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="output_container">
            <h3>Export Playlist</h3>
            <div className="text_container">
              <div id="out1">
                <p className="out_title">Playlist Title</p>
                <input type="text" value={plTitle} onInput={e => setPlTitle(e.target.value)} placeholder="Enter Title..." className="text title_text"></input>
              </div>
              <div id="out2">
                <p className="out_title">Description</p>
                <textarea value={plDesc} onInput={e => setPlDesc(e.target.value)} placeholder="Enter Description..." className="text desc_text"></textarea>
              </div>
            </div>
            <button
              onClick={() => createPlaylist(code, outPlay.map(itm => itm.id), plTitle, plDesc, true,  setShowModal)}
              disabled={plTitle.length === 0}
            >
              Create Playlist
            </button>
          </div>
        </div>
      }
    </div>
  )
}

export default Editor;
