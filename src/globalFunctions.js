import store from './Redux/store';
import {setLongLink,setShortLink} from './Redux/actionsCreator';
import * as actions from './Redux/actions';
import base from './firebase';

export async function globalLinks(link) //primeste longLink din input
{
    const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    const isValid = regex.exec(link);   //boolean care verifica apartenenta la patternul regexului
    if(isValid) 
    {
        console.log("succes");
        //link-ul este valid
        //trebuie identificat formatul exact(cu http sau cu www in prefix si executat "short link" din store)
        let prefixhttp = link.slice(0,4); //cuprinde doar 'http'
        let prefixWWW = link.slice(0,3); //cuprien doar 'www'

        if(prefixhttp == 'http')
        {
            console.log("caz http");
            //nu fac ajustari, foloste direct in 
            store.dispatch(setLongLink(link));

            return true;
        }
        else if(prefixWWW === 'www')
        {
            console.log("caz www");
            //prelucreaza, adauga https in fata
            let final_link = 'https://' + link;
            store.dispatch(setLongLink(final_link));
            
              
            
            return true;     
        }
        else
        {
            console.log("caz basic");
            //adauga si http si www in fata
            let final_link = 'https://www.' + link;
            store.dispatch(setLongLink(final_link))
            
            return true;
        }

        //in acest punct, avem in store longLink
        //-preia baza de date intr-o var locala


        //genereaza un short link pana cand nu se gaseste in baza de date locala
        //updateaza store cu short link
        //update baza de date

    }
    else
    {
        return false;
    }
}
export async function  updateGlobalLinks(link)
{
    return new Promise(async (resolve, reject)=>{
        if(verificaRegex(link) == true)
        {
            console.log("da");
            //pana aici link-ul este un regex corect
            //in continuare se genereaza un short link - se incarca direct in store
            //se updateaza in base
            //se updateaza in store
            calibreazaLinkStore(link);

            let local_base;
            await base.firestore().collection("links").doc("links_doc").get().then((doc)=>{
                local_base = doc.data();    
            }).catch((err)=>{
                console.log("EROARAE",err);
            })

            console.log("data din base =",local_base);
            
            let short_link = generateShortLinkCode();
            //let short_link = 'klkaushlhd';
            
            while(compara(local_base, short_link))
            {
                console.log("s-a gasit dublura in local_base");
                short_link = generateShortLinkCode();
            }

            store.dispatch(setShortLink(short_link));
            console.log("aicisea");

            //update in firestore() cu shortLink si longLink

            await base.firestore().collection("links").doc("links_doc").update({
                [short_link] : { //[ ] pentru a luat valoarea, si nu pentru a reprezenta o cheie in mapa cu care se face update la firestore.
                    'shortLink': short_link,
                    'longLink': store.getState().longLink
                }
            })
            console.log("s-a facut updat in firestire cu valorile:",short_link, store.getState().longLink);
            resolve(true);
        }
        else
        {
            reject(false);
        }
    })
}
function verificaRegex(link) //returneaza boolean
{
    const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    const isValid = regex.exec(link);
    if(isValid)
    {
        return true;
    }
    else
    {
        return false;
    }
}
function calibreazaLinkStore(link) //din link, aduca la forma https://WWW.... si incarca in store longLink
{
    let prefixhttp = link.slice(0,4); //cuprinde doar 'http'
        let prefixWWW = link.slice(0,3); //cuprien doar 'www'

        if(prefixhttp == 'http')
        {
            console.log("caz http");
            //nu fac ajustari, foloste direct in 
            store.dispatch(setLongLink(link));
        }
        else if(prefixWWW === 'www')
        {
            console.log("caz www");
            //prelucreaza, adauga https in fata
            let final_link = 'https://' + link;
            store.dispatch(setLongLink(final_link));    
        }
        else
        {
            console.log("caz basic");
            //adauga si http si www in fata
            let final_link = 'https://www.' + link;
            store.dispatch(setLongLink(final_link))

        }
}
function generateShortLinkCode() //returneaza un short link
{
  let temp = Math.random();
    temp *=100000;
    temp = Math.floor(temp)
     //uneori se formeaza un cod cu mai putin de 5 digits, iar while-ul nu lasa sa iasa din el astfel de date
    while(temp <10000)
    {
        console.log("la intrare",temp)
        temp =Math.random()
        temp *=100000;
        temp = Math.floor(temp)
    }
    return temp;
}

function compara(obiect, string) //obiect este un obiect cu key si values ca fiind alte obiecte (dataBase)
{
    for(var key in obiect)
    {
        console.log("TET");
        if(obiect.hasOwnProperty(key))
        {
            let link_x = obiect[key];
            console.log("comapara:",link_x['shortLink'] , string);
            if(link_x['shortLink'] == string)
            {
                return true;
            }
        }
    }
    return false;
}

export async function decideRediret(linkParametru)
{
    return new Promise(async (resolve, reject)=>{
        let local_base;
        await base.firestore().collection('links').doc('links_doc').get().then((doc)=>{
            local_base = doc.data();
        }).catch(()=>{
            console.log("Eroare la fetch date din firestore");
        })
        for(let key in local_base)
        {
            if(local_base.hasOwnProperty(key))
            {
                console.log(local_base[key]);
                if(local_base[key].shortLink == linkParametru)
                {
                    resolve(local_base[key].longLink);
                }
            }
        }
        reject("Faile, nu s-a gasit id in base");
    })
}