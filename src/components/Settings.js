import './Settings.css'
import {useState} from 'react'
import Select from 'react-select'
import { Slider, RangeSlider } from './Slider'
import CheckBox from './CheckBox'

function compare( variable ) {
  return function (a, b) {
    if (typeof a[variable] === 'string') {
      if ( a[variable].toLowerCase() < b[variable].toLowerCase() ){
        return -1;
      }
      if ( a[variable].toLowerCase() > b[variable].toLowerCase() ){
        return 1;
      }
      return 0;
    } else {
      if ( a[variable] < b[variable] ){
        return -1;
      }
      if ( a[variable] > b[variable] ){
        return 1;
      }
      return 0;
    }
  }
}

const playlistGen = ({tracks, artists, genres, explicit, similar, minKeepYear, maxKeepYear, simAgg, keepArt, keepGen, setOutPlay}) => {
  var outGen = [...keepGen]
  if (similar) {
    const thresh = Math.sqrt(artists.length) * simAgg
    keepArt.forEach(artist => {
      var artGens = genres.filter(itm => itm.id === artist)
      var minGenre = 0
      if (artGens.length > 0) {
        minGenre = Math.min(...artGens.map(itm => itm.genre_count))
      }
      outGen.push(artGens.filter(itm => itm.genre_count <= Math.max(thresh,minGenre)).map(itm => itm.genre))
    })
    outGen = [...new Set(outGen.flat())]
  }
  const outArt = [...new Set([...genres.filter(gen => outGen.includes(gen.genre)).map(itm => itm.id), ...keepArt])]
  const outTracks = tracks.filter(track => 
    (track.artists.map(itm => itm.id).some(itm => outArt.includes(itm))) &&
    (!track.explicit || explicit) &&
    (track.release_date >= minKeepYear) &&
    (track.release_date <= maxKeepYear)
  ).map(itm => ({...itm, ...{main_artist: itm['artists'][0]['name']}}))
  setOutPlay(
    outTracks
    .sort(compare('name'))
    .sort(compare('release_date'))
    .sort(compare('main_artist'))
  )
}

const Settings = ({ tracks, artists, genres, setOutPlay }) => {
  const [explicit, setExplicit] = useState(true)
  const [similar, setSimilar] = useState(true)
  const minYear = Math.min(...tracks.map(track => track.release_date))
  const maxYear = Math.max(...tracks.map(track => track.release_date))
  const [minKeepYear, setMinKeepYear] = useState(minYear)
  const [maxKeepYear, setMaxKeepYear] = useState(maxYear)
  const [simAgg, setSimAgg] = useState(1.3)
  const [keepArt, setKeepArt] = useState([])
  const [keepGen, setKeepGen] = useState([])

  const artistOpts = artists.map(artist => ({
    value: artist.id, label: artist.name
  })).sort( compare('label') )

  const genreOpts = genres
    .map(genre => ({
      value: genre.genre, label: genre.genre
    }))
    .filter((value, index, self) => 
      self.findIndex(t => t.value === value.value) === index
    )
    .sort( compare('label') )


  return (
    <div id="settings">
      <h3>Playlist Parameters</h3>
      <div id="checkbox_group">
        <div id="explicit_checkbox">
          <CheckBox
            checked={explicit}
            setChecked={setExplicit}
            label={'Include Explicit?'}
          />
        </div>
        <div id="similar_checkbox">
          <CheckBox
            checked={similar}
            setChecked={setSimilar}
            label={'Include Similar Artists?'}
          />
        </div>
      </div>
      <div id='slider_group'>
        <div id="year_slider">
          <p className="widget_title slider_title">Years</p>
          <RangeSlider
            min={minYear}
            max={maxYear}
            onChange={(min, max) => {
              setMinKeepYear(min)
              setMaxKeepYear(max)
            }}
          />
        </div>
        <div id="similar_slider">
          <p className="widget_title slider_title">Similarity</p>
          <Slider 
            min={0.0}
            max={1.5}
            value={simAgg}
            scale={0.1}
            onChange={(value) => {setSimAgg(value)}}
          />
        </div>
      </div>
      <p className="widget_title">Artists</p>
      <Select
        options={artistOpts}
        isMulti={true}
        onChange={data => {setKeepArt(data.map(itm => itm.value))}}
        className="select_box"
      />
      <p className="widget_title">Genres</p>
      <Select
        options={genreOpts}
        isMulti={true}
        onChange={data => {setKeepGen(data.map(itm => itm.value))}}
        className="select_box"
      />
      <button onClick={() => playlistGen({tracks, artists, genres, explicit, similar, minKeepYear, maxKeepYear, simAgg, keepArt, keepGen, setOutPlay})}>Generate Playlist</button>
    </div>
  )
}

export default Settings