import React, { useContext, useEffect } from 'react'
import { MessagePopupContext } from '../../App';

const MessagePopup = () => {

  const popup = useContext(MessagePopupContext);


  return (
    <div className={'message-popup ' + (popup.isActive ? 'active' : 'hidden')}>
        <div className='content'>
            <p className='message'>{popup.message}</p>
        </div>
    </div>
  )
}

export default MessagePopup