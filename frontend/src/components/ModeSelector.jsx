import '../resources/css/ModeSelector.css';

const ModeSelector = ({mode,onClickHandler}) => {
  return (
    <div className="modeSelector-container" onClick={onClickHandler}>
        <span>{mode+" Mode"}</span>
        <input type="checkbox"/>
    </div>
  )
}

export default ModeSelector