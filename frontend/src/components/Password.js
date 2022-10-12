import '../resources/css/Password.css'

function Password(props) {
    return (
      <div className="password">
        <h2>Website: {props.data.website}</h2>
        <p>Password: {props.data.hash} <button>Show</button></p>
        
      </div>
    )
  }
  
  export default Password