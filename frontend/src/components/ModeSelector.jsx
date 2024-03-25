import '../resources/css/ModeSelector.css';

const ModeSelector = ({mode,onClickHandler}) => {
  return (
    <div className="modeSelector-container" onClick={onClickHandler}>
        <span id='mode-span'>{mode+" Mode"}</span>
        <input type="checkbox" id='mode-input'/>
    </div>
  )
}

export default ModeSelector