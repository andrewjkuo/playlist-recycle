import SpotifyWebApi from 'spotify-web-api-node'

const procTracks = (data) => {
  return data.body.items.filter(item => !item.is_local && item.track.name !== '').map(item => {
    var d = new Date(item.track.album.release_date)
    return {
      id: item.track.id,
      name: item.track.name,
      artists: item.track.artists,
      album: item.track.album.name,
      release_date: d.getFullYear(),
      duration: item.track.duration_ms / 60000,
      explicit: item.track.explicit,
      popularity: item.track.popularity
    }
  }
  )
}

const procArtists = (data) => {
  return data.map((item) => (item.artists)).flat().map((item) => ({
    id: item.id,
    name: item.name
  })
  )
}

const procGenres = (data) => {
  return data.map((artist) => (
    artist.genres.map(genre => ({
      id: artist.id,
      name: artist.name,
      genre: genre
    }))
  )).flat()
}

async function fetchPlaylist(spotifyApi, playlistId, page=0, prevResponse=[]) {
  const request = spotifyApi.getPlaylistTracks(playlistId, {
    offset: 100*page
  })
  return request
  .then(data => {
    const response = [...prevResponse, ...procTracks(data)]
    if (data.body.next) {
      return fetchPlaylist(spotifyApi, playlistId, page+1, response)
    }
    return response
  })
  .catch(err => window.location.replace('/'))
}

async function fetchGenres(spotifyApi, artistIds) {
  const request = spotifyApi.getArtists(artistIds)
  return request
  .then(data => {
    return procGenres(data.body.artists)
  })
  .catch(err => window.location.replace('/'))
}

async function getProfile(accessToken) {
  var spotifyApi = new SpotifyWebApi({
    accessToken: accessToken
  })
  const request = spotifyApi.getMe()
  return request
    .then(data => data.body)
    .catch(err => window.location.replace('/'))
}

const getPlaylists = (accessToken, setPlaylists) => {
  var spotifyApi = new SpotifyWebApi({
    accessToken: accessToken
  })
  const request = spotifyApi.getUserPlaylists()
  request
    .then(data => {
      const outData = data.body.items.map(playlist => ( 
        { ...playlist, include: false}
      ))
      setPlaylists(outData)
    })
    .catch(err => window.location.replace('/'))
}

const getTracks = (accessToken, playlistIds, setTracks, setArtists, setGenres) => {
  var spotifyApi = new SpotifyWebApi({
    accessToken: accessToken
  })
  const allPlayPromises = []
  for (let i = 0; i < playlistIds.length; i++) {
    allPlayPromises.push(fetchPlaylist(spotifyApi, playlistIds[i], 0, []))
  }

  Promise.all(allPlayPromises)
  .then((values) => {
    const tracksNoDup = values.flat().filter((value, index, self) => 
      self.findIndex(t => t.id === value.id) === index
    )
    const artistsNoDup = procArtists(tracksNoDup).filter((value, index, self) => 
      self.findIndex(t => t.id === value.id) === index
    )
    setTracks(tracksNoDup)
    setArtists(artistsNoDup)

    const allGenPromises = []
    const maxPage = Math.floor((artistsNoDup.length - 1) / 50) + 1
    for (let i = 0; i < maxPage; i++) {
      allGenPromises.push(fetchGenres(spotifyApi, artistsNoDup.map(itm => (itm.id)).slice(i*50, (i+1)*50)))
    }
    Promise.all(allGenPromises)
    .then((values) => {
      const flatGenres = values.flat()
      setGenres(
        flatGenres.map(data => {
          return {
          ...data,
          genre_count: flatGenres.filter(data2 => 
            data2.genre === data.genre
          ).length
          }
        }).filter(data => data.genre_count > 1)
      )
    })
    .catch(err => window.location.replace('/'))

  })
  .catch(err => window.location.replace('/'))
}

const createPlaylist = (accessToken, trackIds, plName, plDesc, isPublic=true, setShowModal) => {
  var spotifyApi = new SpotifyWebApi({
    accessToken: accessToken
  })
  spotifyApi.createPlaylist(
    plName,
    {description: plDesc, public: isPublic}
  )
  .then(data => {
    const playlistId = data.body.uri.split(':')[2]
    const allGenPromises = []
    const maxPage = Math.floor((trackIds.length - 1) / 100) + 1
    for (let i = 0; i < maxPage; i++) {
      allGenPromises.push(spotifyApi.addTracksToPlaylist(
        playlistId,
        trackIds.slice(i*100, (i+1)*100).map(itm => 'spotify:track:'+itm)
      ))
    }
    Promise.all(allGenPromises)
    .then((values) => {setShowModal(true)})
    .catch(err => window.location.replace('/'))
  })
  .catch(err => window.location.replace('/'))
  setShowModal(true)

}

export { getProfile, getPlaylists, getTracks, createPlaylist }
