const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID || 'f8b6de26f95e4276b9e4274008549c1e'
const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const AUTHORIZE_URL = 'https://accounts.spotify.com/authorize'
const SCOPES = [
  'playlist-modify-private',
  'playlist-modify-public',
  'playlist-read-private',
  'user-read-email',
  'user-read-private'
].join(' ')

const ACCESS_TOKEN_KEY = 'spotify_access_token'
const REFRESH_TOKEN_KEY = 'spotify_refresh_token'
const TOKEN_EXPIRES_AT_KEY = 'spotify_token_expires_at'
const CODE_VERIFIER_KEY = 'spotify_code_verifier'
const AUTH_STATE_KEY = 'spotify_auth_state'

const redirectUri = () => `${window.location.origin}/`

const redirectToLoopbackIp = () => {
  if (window.location.hostname !== 'localhost') {
    return false
  }

  const loopbackUrl = new URL(window.location.href)
  loopbackUrl.hostname = '127.0.0.1'
  loopbackUrl.search = ''
  loopbackUrl.hash = ''
  window.location.replace(loopbackUrl.toString())

  return true
}

const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const values = window.crypto.getRandomValues(new Uint8Array(length))

  return values.reduce((acc, value) => acc + possible[value % possible.length], '')
}

const sha256 = async (plain) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)

  return window.crypto.subtle.digest('SHA-256', data)
}

const base64UrlEncode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

const storeTokenResponse = (tokenResponse) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokenResponse.access_token)
  localStorage.setItem(
    TOKEN_EXPIRES_AT_KEY,
    String(Date.now() + (tokenResponse.expires_in * 1000))
  )

  if (tokenResponse.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, tokenResponse.refresh_token)
  }
}

const clearTokenStorage = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(TOKEN_EXPIRES_AT_KEY)
}

const requestToken = async (body) => {
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(body)
  })
  const tokenResponse = await response.json()

  if (!response.ok) {
    throw new Error(tokenResponse.error_description || tokenResponse.error || 'Spotify token request failed')
  }

  storeTokenResponse(tokenResponse)

  return tokenResponse.access_token
}

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)

  if (!refreshToken) {
    return null
  }

  try {
    return await requestToken({
      client_id: CLIENT_ID,
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  } catch (error) {
    clearTokenStorage()
    throw error
  }
}

const getStoredAccessToken = async () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
  const expiresAt = Number(localStorage.getItem(TOKEN_EXPIRES_AT_KEY))

  if (accessToken && expiresAt > Date.now() + 60000) {
    return accessToken
  }

  return refreshAccessToken()
}

const startSpotifyLogin = async () => {
  if (redirectToLoopbackIp()) {
    return
  }

  const codeVerifier = generateRandomString(64)
  const codeChallenge = base64UrlEncode(await sha256(codeVerifier))
  const state = generateRandomString(32)
  const authUrl = new URL(AUTHORIZE_URL)

  localStorage.setItem(CODE_VERIFIER_KEY, codeVerifier)
  localStorage.setItem(AUTH_STATE_KEY, state)
  authUrl.search = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: redirectUri(),
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    state
  }).toString()

  window.location.replace(authUrl.toString())
}

const exchangeCodeForAccessToken = async (code, state) => {
  const expectedState = localStorage.getItem(AUTH_STATE_KEY)
  const codeVerifier = localStorage.getItem(CODE_VERIFIER_KEY)

  if (expectedState && state !== expectedState) {
    throw new Error('Spotify login state did not match')
  }

  if (!codeVerifier) {
    throw new Error('Spotify login verifier was missing')
  }

  try {
    return await requestToken({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri(),
      code_verifier: codeVerifier
    })
  } finally {
    localStorage.removeItem(CODE_VERIFIER_KEY)
    localStorage.removeItem(AUTH_STATE_KEY)
  }
}

export { exchangeCodeForAccessToken, getStoredAccessToken, startSpotifyLogin }
