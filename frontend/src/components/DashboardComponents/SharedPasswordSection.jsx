import React, { useEffect } from 'react'
import SharedPassword from './SharedPassword'

const SharedPasswordSection = ({sharedPasswords}) => {
  useEffect(() => {
    //console.log('Shared Passwords', sharedPasswords)
  },[])
  return (
    <section className="passwords">
        <h2>Sharing passwords</h2>
        <div className="shared-list">
            {sharedPasswords && sharedPasswords.length > 0 ? sharedPasswords.map(psswd => <SharedPassword key={psswd.sh._id} data={psswd}/>) : <p>You don't have any shared passwords</p>}
        </div>
    </section>
  )
}

export default SharedPasswordSection