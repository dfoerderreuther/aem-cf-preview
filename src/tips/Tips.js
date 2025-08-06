import React, { useEffect, useState } from "react";
import './Tips.css'
import AEMHeadless from '@adobe/aem-headless-client-js';

const DOMAIN = 'https://publish-p91256-e801658.adobeaemcloud.com';
const ENDPOINT = '/graphql/execute.json';

export default function Tips() {
    const [path, setPath] = useState('');
    const [variations, setVariations] = useState([]);

    const aemHeadlessClient = new AEMHeadless({
        serviceURL: DOMAIN,
        endpoint: ENDPOINT
    })

    useEffect(() => {
        let queryParameters = new URLSearchParams(window.location.search)
        setPath(queryParameters.get("param"));
    }, []);

    useEffect(() => {
        if (!path && path.length === 0) return; 
          aemHeadlessClient.runPersistedQuery('dfsite/m11Tips', {
            'path': path, 
            'd': Math.round(Math.random()*100000000)
          })
            .then(data => {
                if (!data.data) return;
                let tips = data.data.tipsByPath.item;
                setVariations(tips._variations || [])
            })
            .catch(error => {
                console.error('Error fetching tips variations:', error);
                setVariations([]);
            });
    }, [path])

    return <>
        <div className="header">
            <h1>M11 Tips</h1>
            <h2>Path: {path}</h2>
        </div>
        <h3 className="cfTitle">Main variation</h3>
        <TipsDisplay path={path} />
        
        { variations.map((variation) => <>
            <h3 className="cfTitle">{variation}</h3>
            <TipsDisplay path={path} variation={variation} />
        </>
        )}
        <p><br /></p>
    </>;
}

function TipsDisplay({path, variation}) {
    const [items, setItems] = useState([]);

    const aemHeadlessClient = new AEMHeadless({
        serviceURL: DOMAIN,
        endpoint: ENDPOINT
    })

    useEffect(() => {
        if (!path && path.length === 0) return; 

        aemHeadlessClient.runPersistedQuery('dfsite/m11Tips', {
            'path': path, 
            'variation': variation,
            'd': Math.round(Math.random()*100000000)
          })
            .then(data => {
                if (!data.data) return;
                let tips = data.data.tipsByPath.item;
                // The response contains a single tip item, not an array
                setItems(tips ? [tips] : [])
            })
            .catch(error => {
                console.error('Error fetching tips:', error);
                setItems([]);
            });
    }, [path, variation])

    const editorProps = {
		"data-aue-resource": "urn:aemconnection:" + path + "/jcr:content/data/" + (variation ? variation : "master"),
		"data-aue-type": "reference",
		itemfilter: "cf"
	};
    
    return <div className="Tips" {...editorProps}>
        {items.map((item, index) => (
            <TipItem key={index} item={item} />
        ))}
    </div>;
}

function TipItem({item}) {
    if (!item || !item.hasOwnProperty('type') || !item.hasOwnProperty('message')) return <></>

    const editorProps = {
		"data-aue-resource": "urn:aemconnection:" + item._path + "/jcr:content/data/master",
		"data-aue-type": "reference",
		itemfilter: "cf"
	};

    return <div className="tip-item" {...editorProps}>
        <div className="tip-type" data-aue-prop="type" data-aue-type="text" data-aue-label="Type">{item.type}</div>
        <div className="tip-message" dangerouslySetInnerHTML={{__html: item.message.html}} data-aue-prop="message" data-aue-type="text" data-aue-label="Message"></div>
        <CallToAction item={item} />
    </div>
}

function CallToAction({item}) {
    if (item.call2Action && item.link) return <a className="tip-action" href={item.link} target="_blank" data-aue-prop="call2Action" data-aue-type="text" data-aue-label="Call To Action">{item.call2Action}</a>
}

// https://author-p91256-e801658.adobeaemcloud.com/graphql/execute.json/dfsite/m11Tips