import React, {useState, useEffect} from 'react'
import {decideRediret} from './globalFunctions';
import PageNotFound from './PageNotFound';
import {Redirect} from 'react-router-dom';
import {useHistory} from 'react-router-dom';


const RedirectComponent = (props) => {
    const [currentPageId, setCurrentPageId] = useState(props.match.params.id);
    const [shouldRedirect] = useState(false);

    const history = useHistory();

    useEffect(async ()=>{
        console.log(currentPageId);

        await decideRediret(currentPageId).then((resp)=>{
            console.log("Se face redirect la:", resp);
            window.location.replace(`${resp}`);

        }).catch(()=>{
            console.log("nu se face redirect");

            history.push('/pagenotfound');
        })
    })
    return (
        <div>
            <p>{currentPageId}</p>
            <p>Loading Page</p>
        </div>
    )
}

export default RedirectComponent
