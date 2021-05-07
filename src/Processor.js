import React,{useState, useEffect} from 'react'
import './Processor.css';
import './App.css';
import logo from './images/logo.png';
import link_img  from './images/link.png';
import copy_img  from './images/copy.png';
import {globalLinks,updateGlobalLinks} from './globalFunctions';
import store from './Redux/store';

const Processor = () => {
    const [inputLong, setInputLong] = useState(''); //long link string input data
    const [outputShort, setOutputShort] = useState('');
    
    const[isLinkEmpty, setIsLinkEmpty] = useState(false);   //boolean - link is empty - red card

    const [showShort, setShowShort] = useState(false);  //show hidden copy card
    const [domeniu, setDomeniu] = useState('https://www.ceva-site.com/')    //hard coded constant


    const [disableCreate, setDisableCreate] = useState(false);
    const [classCopy, setClassCopy] = useState('base_copy_class');  //css logic for incresing opacity className



    function handleInputChange(event)
    {
        setIsLinkEmpty(false);
        setShowShort(false);
        setClassCopy('base_copy_class');
        setDisableCreate(false);

        setInputLong(event.target.value);

    }
    async function shortLinkAction()
    {
        if(inputLong != '')
            {
                await updateGlobalLinks(inputLong).then((resp)=>{
                    console.log("Update global links - succes");
                    console.log("RESP:",resp);
                    setDisableCreate(true);

                }).catch((resp)=>{
                    console.log("Update global links - failed");
                    console.log("RESP:",resp);
                })
                setShowShort(true);
            }
        else
            {
                console.log("empty input link")
                setIsLinkEmpty(true);
            }
    }
    function copyLink()
    {
        let temp_link = `${domeniu}${store.getState().shortLink}`;
        navigator.clipboard.writeText(temp_link);
        setClassCopy('copied_to_clip');
    }

    function test()
    {
        console.log(store.getState().shortLink);
        console.log(store.getState().longLink);

    }
    return (
        
    <div className="App">
        <div className="processor-body">
            <div className="logo">
                <img src={logo} alt="logo"/>
            </div>
            
            <div className="main-processor">
                <div className="get-input">
                    <p>Paste your long URL here:</p>
                    {
                        isLinkEmpty?(<p id="empty-link-span">Empty link, please complete</p>):null
                    }
                    
                    <div className={isLinkEmpty?"input-box red-underline":"input-box"}>
                        <img src={link_img} alt="link img"/>
                        <input 
                        placeholder="https://twitter.com/elonmusk?lang=ro" 
                        value={inputLong} 
                        onChange={handleInputChange}
                        />
                        <button onClick={shortLinkAction} disabled={disableCreate}>Shorten</button>
                    </div>
                    
                </div>

                    {
                        showShort?(
                            <div className="print-output">
                                <div className="alignment">
                                    <p>Your short URL:</p>
                                    <div className="out-put-box">
                                        <img src={link_img} alt="link img"/>
                                        <span>
                                            {domeniu}{store.getState().shortLink}
                                        </span>
                                        <button onClick={copyLink}>
                                            <img src={copy_img} alt="copy_img"/>
                                        </button>
                                    </div>
                                </div>
                                <p className={classCopy}>Copied to clipboard</p>
                            </div>
                        ):null
                    }
            </div>
        </div>
    </div>
    )
}

export default Processor
