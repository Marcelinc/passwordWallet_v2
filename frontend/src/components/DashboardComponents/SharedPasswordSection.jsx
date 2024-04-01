import React from 'react'

const SharedPasswordSection = ({sharedPasswords}) => {
  return (
    <section className="passwords">
        <h2>Sharing passwords</h2>
        <div className="shared-list">
            {sharedPasswords && sharedPasswords.length > 0 ? sharedPasswords.map(psswd => <p key={psswd.sh._id}>
                Password: <span className="sharedPassword">{psswd.decryptedPassword} </span> 
                from <span className="sharedOwner">{psswd.sh.id_owner.login}</span>
                </p>) : <p>You don't have any shared passwords</p>}
        </div>
    </section>
  )
}

export default SharedPasswordSection