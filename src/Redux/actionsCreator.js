import * as actions from './actions';

export function setLongLink(link)
{
    console.log("set long link");
    return{
        type: actions.LONG_ADDED,
        payload:{
            longLink: link
        }
    }
}
export function setShortLink(link)
{
    console.log('set short link');
    return{
        type: actions.SHORT_ADDED,
        payload:{
            shortLink: link
        }
    }
}