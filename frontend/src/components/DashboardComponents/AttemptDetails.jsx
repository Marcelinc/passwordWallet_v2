import { useState } from "react";
import { FaCaretSquareDown, FaCaretSquareUp } from "react-icons/fa";

const AttemptDetails = ({attempt}) => {
    const [showDetails,setShowDetails] = useState(false);

    return (<div key={attempt._id} className='attempt'>
        <p>
            {attempt.correct ? <span className="successLogin">Successful</span> : <span className="failedLogin">Failed</span>} login attempt {attempt.createdAt.substring(11,19)} {attempt.createdAt.substring(0,10)}
        </p>
        <div className={"attempt-details "+ (showDetails ? 'active' : '')}>
            <p>Adres IP: {attempt.id_address.addressIP}</p>
            <p>Urządzenie: {attempt.computer.split(';')[0]}, {attempt.computer.split(';')[1]}</p>
        </div>
        {showDetails ? <FaCaretSquareDown className="expandAttempt" onClick={() => setShowDetails(!showDetails)}/> :
        <FaCaretSquareUp className="expandAttempt" onClick={() => setShowDetails(!showDetails)}/>}
    </div>)
}

export default AttemptDetails