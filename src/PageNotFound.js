import React from 'react'
import './Pagenotfound.css';
import {Link} from 'react-router-dom';
const PageNotFound = () => {
    return (
        <div className="notfound_body">
            <div className="notfound-content">
                <h2>404 - Looks like you're lost</h2>
                <p>Maybe this page used to exist or you just spelled something wrong</p>
                <Link to="/"><button>Return Home</button></Link>
            </div>
            
        </div>
    )
}

export default PageNotFound
