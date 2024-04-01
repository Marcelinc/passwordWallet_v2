import '../resources/css/ModeSelector.css';

const ModeSelector = ({mode,onClickHandler}) => {
  return (
    <div className="modeSelector-container" onClick={onClickHandler} title={mode + ' Mode'}>
        <input type='checkbox' className='mode-input' checked={mode === 'Edit'} readOnly/>
        {/*<span className='mode-span'>
          {/*mode === 'Edit' ? <TfiWrite/> : <CiRead/>}
        </span>*/}
        <span className='mode-text'>{mode === 'Edit' ? 'Manage Mode' : 'Read Mode'}</span>
    </div>
  )
}

export default ModeSelector