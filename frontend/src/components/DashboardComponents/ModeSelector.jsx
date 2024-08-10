import '../../resources/css/ModeSelector.css';

const ModeSelector = ({mode,onClickHandler}) => {
  return (
    <div className="modeSelector-container" onClick={onClickHandler} title={mode + ' Mode'}>
        <input type='checkbox' className='mode-input' checked={mode === 'Edit'} readOnly/>
        <span className='mode-text'>{mode === 'Edit' ? 'Read Mode' : 'Manage Mode'}</span>
    </div>
  )
}

export default ModeSelector