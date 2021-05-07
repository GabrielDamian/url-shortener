import * as actions from './actions';
import base from '../firebase';

function reducer(state = {longLink: '',shortLink: ''}, action)
{
    switch(action.type)
    {
        case actions.LONG_ADDED:
            console.log("deep:", action.payload.longLink);
            console.log("deep_2",state.longLink);
            return {
                ...state,
                longLink: action.payload.longLink
            }
        case actions.SHORT_ADDED:
            return {
                ...state,
                shortLink: action.payload.shortLink
            }

        default:
            return state;

    }
    
}

export default reducer;
