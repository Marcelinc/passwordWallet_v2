import AttemptDetails from "./AttemptDetails";

const SecuritySection = ({loginAttempts}) => {
  return (
    <section className="passwords">
        <h2>Login attempts</h2>
        <div className="attempt-list">
            {loginAttempts && loginAttempts.length > 0 ? loginAttempts.map(attempt => <AttemptDetails  attempt={attempt} key={attempt._id}/>)
                : <p>There are no login attempts yet</p>}
        </div>
    </section>
  )
}

export default SecuritySection