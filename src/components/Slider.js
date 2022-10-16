import { useCallback, useEffect, useState, useRef } from "react"

const RangeSlider = ({ min, max, onChange }) => {
  const [minVal, setMinVal] = useState(min)
  const [maxVal, setMaxVal] = useState(max)
  const minValRef = useRef(min)
  const maxValRef = useRef(max)
  const range = useRef(null)

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal)
    const maxPercent = getPercent(maxValRef.current)

    if (range.current) {
      range.current.style.left = `${minPercent}%`
      range.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [minVal, getPercent])

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current)
    const maxPercent = getPercent(maxVal)

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [maxVal, getPercent])

  // Get min and max values when their state changes
  useEffect(() => {
    onChange(min=minVal, max=maxVal)
  }, [minVal, maxVal, onChange])

  return (
    <div className="slider_container">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal - 1)
          setMinVal(value)
          minValRef.current = value
        }}
        className="thumb thumb--left"
        style={{ zIndex: minVal > max - 100 && "5" }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal + 1)
          setMaxVal(value)
          maxValRef.current = value;
        }}
        className="thumb thumb--right"
      />

      <div className="slider">
        <div className="slider__track" />
        <div ref={range} className="slider__range" />
        <div className="slider__left-value">{minVal}</div>
        <div className="slider__right-value">{maxVal}</div>
      </div>
    </div>
  );
};

const Slider = ({ min, max, value, scale=1, onChange }) => {
  const [val, setVal] = useState(value / scale)
  const valRef = useRef(value / scale)

  // Get min and max values when their state changes
  useEffect(() => {
    onChange(value=val * scale);
  }, [val, onChange]);

  return (
    <div className="slider_container">
      <input
        type="range"
        min={min / scale}
        max={max / scale}
        value={val}
        onChange={(event) => {
          setVal(event.target.value)
          valRef.current = event.target.value
        }}
        className="thumb"
      />
      <div className="slider">
        <div className="slider__track" />
        <div className="slider__left-value">{min}</div>
        <div className="slider__right-value">{max}</div>
      </div>
    </div>
  );
};


export { Slider, RangeSlider }
