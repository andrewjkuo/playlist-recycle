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

const playlistGen = ({tracks, artists, genres, explicit, minKeepYear, maxKeepYear, simAgg, keepArt, keepGen, setOutPlay}) => {
  var outGen = [...keepGen]
  const thresh = Math.sqrt(artists.length) * simAgg * simAgg
  keepArt.forEach(artist => {
    var artGens = genres.filter(itm => itm.id === artist)
    outGen.push(artGens.filter(itm => itm.genre_count <= thresh).map(itm => itm.genre))
  })
  outGen = [...new Set(outGen.flat())]
  const outArt = [...new Set([...genres.filter(gen => outGen.includes(gen.genre)).map(itm => itm.id), ...keepArt])]
  const outTracks = tracks.filter(track => 
    (
      (track.artists.map(itm => itm.id).some(itm => outArt.includes(itm))) ||
      (keepArt.length + keepGen.length === 0)
    ) &&
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
  const minYear = Math.min(...tracks.map(track => track.release_date))
  const maxYear = Math.max(...tracks.map(track => track.release_date))
  const [minKeepYear, setMinKeepYear] = useState(minYear)
  const [maxKeepYear, setMaxKeepYear] = useState(maxYear)
  const [simAgg, setSimAgg] = useState(1.1)
  const [keepArt, setKeepArt] = useState([])
  const [keepGen, setKeepGen] = useState([])

  const artistOpts = artists.map(artist => ({
    value: artist.id, label: artist.name
  })).sort( compare('label') )

  const genreOpts = genres
    .map(genre => ({
      value: genre.genre, label: genre.genre+' ('+genre.genre_count+' artists)'
    }))
    .filter((value, index, self) => 
      self.findIndex(t => t.value === value.value) === index
    )
    .sort( compare('label') )


  return (
    <div id="settings">
      <h3>Playlist Parameters</h3>
      <div id="checkbox_group">
        <CheckBox
          checked={explicit}
          setChecked={setExplicit}
          label={'Include Explicit Tracks?'}
        />
      </div>
      <div id='slider_group'>
        <div id="year_slider">
          <div className="tooltip tooltip_l">
            <p className="widget_title slider_title">Release Years</p>
            <span className="tooltiptext tooltiptext_l">
              Choose a range of years (inclusive of min and max).
              Only tracks released in this period will be included.
            </span>
          </div>
          <RangeSlider
            min={minYear}
            max={maxYear}
            setMinKeepYear={setMinKeepYear}
            setMaxKeepYear={setMaxKeepYear}
          />
        </div>
        <div id="similar_slider">
          <div className="tooltip tooltip_r">
            <p className="widget_title slider_title">Similarity Threshold</p>
            <span className="tooltiptext tooltiptext_r">
              This parameter controls how aggressively the tool will search
              for similar artists. If set to min then only the specific
              artists chosen will be included. Experiment with different
              values until you get a playlist you like.
            </span>
          </div>
          <Slider 
            min={0.0}
            max={2.0}
            value={simAgg}
            scale={0.1}
            numLabels={false}
            setSimAgg={setSimAgg}
          />
        </div>
      </div>
      <div className="tooltip tooltip_l">
        <p className="widget_title">Artists</p>
        <span className="tooltiptext tooltiptext_l">
          Choose some artists that you want included.
          The tool will populate your playlist with them
          and artists in similar genres.
        </span>
      </div>
      <Select
        options={artistOpts}
        isMulti={true}
        onChange={data => {setKeepArt(data.map(itm => itm.value))}}
        className="select_box"
      />
      <div className="tooltip tooltip_l">
        <p className="widget_title">Genres</p>
        <span className="tooltiptext tooltiptext_l">
          It's usually best to leave this field blank. 
          Spotify has over 5000 unique genres but if you
          want to include a few specific ones you can
          add them here.
        </span>
      </div>
      <Select
        options={genreOpts}
        isMulti={true}
        onChange={data => {setKeepGen(data.map(itm => itm.value))}}
        className="select_box"
      />
      <button onClick={() => playlistGen({tracks, artists, genres, explicit, minKeepYear, maxKeepYear, simAgg, keepArt, keepGen, setOutPlay})}>Generate Playlist</button>
    </div>
  )
}

export default Settings