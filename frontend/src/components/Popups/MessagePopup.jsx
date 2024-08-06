import React from 'react'

const MessagePopup = ({message,isActive}) => {
  return (
    <div className={'message-popup ' + (isActive ? 'active' : '')}>
        <div className='content'>
            <p className='message'>{message}</p>
        </div>
    </div>
  )
}

export default MessagePopup