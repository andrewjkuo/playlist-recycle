import SpotifyWebApi from 'spotify-web-api-node'

const API_BASE_URL = 'https://api.spotify.com/v1'
const RATE_LIMIT_RETRIES = 6

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const spotifyFetch = async (accessToken, path, options={}) => {
  const url = new URL(`${API_BASE_URL}${path}`)
  Object.entries(options.query || {}).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })

  for (let attempt = 0; attempt <= RATE_LIMIT_RETRIES; attempt++) {
    const response = await fetch(url.toString(), {
      method: options.method || 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    })

    if (response.status === 429 && attempt < RATE_LIMIT_RETRIES) {
      const retryAfter = Number(response.headers.get('Retry-After') || 1)
      await wait((retryAfter * 1000) + 250)
      continue
    }

    if (!response.ok) {
      const responseText = await response.text()
      const error = new Error(responseText || `Spotify request failed with ${response.status}`)
      error.status = response.status
      throw error
    }

    if (response.status === 204) {
      return null
    }

    return response.json()
  }
}

const procTracks = (data) => {
  return data.items.filter(item => !item.is_local && item.track !== null && item.track.name !== '').map(item => {
    var d = new Date(item.track.album.release_date)
    return {
      id: item.track.id,
      name: item.track.name,
      artists: item.track.artists,
      album: item.track.album.name,
      release_date: d.getFullYear(),
      duration: item.track.duration_ms / 60000,
      explicit: item.track.explicit
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
    (artist.genres || []).map(genre => ({
      id: artist.id,
      name: artist.name,
      genre: genre
    }))
  )).flat()
}

const mergeTracks = (tracks) => {
  return Array.from(tracks.reduce((trackMap, track) => {
    if (!trackMap.has(track.id)) {
      trackMap.set(track.id, track)
    }

    return trackMap
  }, new Map()).values())
}

async function fetchUserPlaylist(spotifyApi, page=0, prevResponse=[]) {
  const request = spotifyApi.getUserPlaylists({offset: page*50, limit: 50})
  return request
  .then(data => {
    const response = [...prevResponse, ...data.body.items]
    if (data.body.next) {
      return fetchUserPlaylist(spotifyApi, page+1, response)
    }
    return response
  })
  .catch(err => window.location.replace('/'))
}

async function fetchPlaylistPage(accessToken, playlistId, offset, endpoint='items') {
  return spotifyFetch(accessToken, `/playlists/${playlistId}/${endpoint}`, {
    query: {
      limit: '50',
      offset: String(offset),
      fields: 'items(is_local,track(id,name,artists(id,name,type),album(name,release_date),duration_ms,explicit)),next'
    }
  })
}

async function fetchPlaylist(accessToken, playlistId) {
  let offset = 0
  let response = []
  let next = true
  let endpoint = 'items'

  while (next) {
    let data
    try {
      data = await fetchPlaylistPage(accessToken, playlistId, offset, endpoint)
    } catch (error) {
      if (endpoint === 'items' && error.status === 403) {
        endpoint = 'tracks'
        data = await fetchPlaylistPage(accessToken, playlistId, offset, endpoint)
      } else {
        throw error
      }
    }
    response = [...response, ...procTracks(data)]
    next = Boolean(data.next)
    offset += 50
  }

  return response
}

async function fetchArtistGenres(accessToken, artistId) {
  return spotifyFetch(accessToken, `/artists/${artistId}`)
    .then(data => procGenres([data]))
    .catch(() => [])
}

async function fetchGenres(accessToken, artistIds) {
  const genres = []
  for (let i = 0; i < artistIds.length; i += 4) {
    const chunk = artistIds.slice(i, i + 4)
    const responses = await Promise.all(chunk.map(artistId => fetchArtistGenres(accessToken, artistId)))
    genres.push(...responses.flat())
    await wait(100)
  }

  return genres
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
  fetchUserPlaylist(spotifyApi, 0, [])
    .then(data => {
      const outData = data.map(playlist => ( 
        { ...playlist, include: false}
      ))
      setPlaylists(outData)
    })
    .catch(err => window.location.replace('/'))
}

const getTracks = (accessToken, playlistIds, setTracks, setArtists, setGenres) => {
  const allPlayPromises = playlistIds.reduce((promise, playlistId) => (
    promise.then(async (responses) => [...responses, await fetchPlaylist(accessToken, playlistId)])
  ), Promise.resolve([]))

  allPlayPromises
  .then((values) => {
    const tracksNoDup = mergeTracks(values.flat()).filter((value) =>
      value.artists[0].type === 'artist'
    )
    const artistsNoDup = procArtists(tracksNoDup).filter((value, index, self) => 
      self.findIndex(t => t.id === value.id) === index
    )
    setTracks(tracksNoDup)
    setArtists(artistsNoDup)

    fetchGenres(accessToken, artistsNoDup.map(itm => (itm.id)))
    .then((flatGenres) => {
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
    const maxPage = Math.floor((trackIds.length - 1) / 50) + 1
    for (let i = 0; i < maxPage; i++) {
      allGenPromises.push(spotifyApi.addTracksToPlaylist(
        playlistId,
        trackIds.slice(i*50, (i+1)*50).map(itm => 'spotify:track:'+itm)
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
