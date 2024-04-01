import Password from "./Password"

const PasswordSection = ({passwords,mode}) => {
  return (
    <section className="passwords">
        <h2>My passwords</h2>
        <div className="password-list">
            {passwords.length > 0 ? passwords.map(password => <Password key={password._id} data={password} mode={mode}/>) : <p>You have no saved passwords</p>}
        </div> 
    </section> 
  )
}

export default PasswordSection