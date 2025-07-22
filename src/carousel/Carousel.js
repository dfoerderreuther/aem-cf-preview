import React, { useEffect, useState } from "react";
import './Carousel.css'
import AEMHeadless from '@adobe/aem-headless-client-js';

const DOMAIN = 'https://publish-p91256-e801658.adobeaemcloud.com';
const ENDPOINT = '/graphql/execute.json';

export default function Carousel() {
    const [path, setPath] = useState('');
    const [style, setStyle] = useState('');
    const [items, setItems] = useState([]);
    const [current, setCurrent] = useState(0);

    const aemHeadlessClient = new AEMHeadless({
        serviceURL: DOMAIN,
        endpoint: ENDPOINT
    })

    useEffect(() => {
        let queryParameters = new URLSearchParams(window.location.search)
        setPath(queryParameters.get("param") || '');
    }, []);

    useEffect(() => {
        if (!path && path.length === 0) return; 
          aemHeadlessClient.runPersistedQuery('dfsite/m09CarouselByPath', {
            'path': path, 
            'd': Math.round(Math.random()*100000000)
          })
            .then(data => {
                if (!data.data) return;
                let carousel = data.data.m09CarouselByPath.item;
                setStyle(carousel.style)
                setItems(carousel.items)
            });
    }, [path])

    const actionPrevious = () => {
        console.log('previous')
        let next = current-1 >= 0 ? current-1 : items.length-1;
        setCurrent(next)
    }
    const actionNext = () => {
        console.log('next')
        let next = current+1 < items.length ? current+1 : 0;
        setCurrent(next)
    }

    useEffect(() => {
        if (style === null && !style) return;
        console.log('style', style)
    }, [style])

    const editorProps = {
		"data-aue-resource": "urn:aemconnection:" + path + "/jcr:content/data/master",
		"data-aue-type": "reference",
		itemfilter: "cf"
	};
    
    return <>
        <div className="header">
            <h1>M09 Carousel</h1>
            <h2>Path: {path}</h2>
            <p><a href="http://ee-style-guide.s3-website-eu-west-1.amazonaws.com/section/12.09" target="_blanl">EE Styleguide M09 Carousel</a></p>
        </div>
        <div className={"Carousel " + style} {...editorProps}>
            <button className="btn lft" onClick={actionPrevious}>&lt;</button>
            <Item item={items[current]} />
            <button className="btn rgt" onClick={actionNext}>&gt;</button>
        </div>
    </>;
}

function Item({item}) {
    if (!item || !item.hasOwnProperty('title') || !item.hasOwnProperty('image')) return <></>
    console.log('item', item)

    const editorProps = {
		"data-aue-resource": "urn:aemconnection:" + item._path + "/jcr:content/data/master",
		"data-aue-type": "reference",
		itemfilter: "cf"
	};

    return <div className="item" {...editorProps}>
        <div className="text">
            <div className="inner">
                <h3 data-aue-prop="title" data-aue-type="text" data-aue-label="Title">{item.title}</h3>
                <Description item={item} /> 
                
            </div>    
        </div>
        <img src={DOMAIN + item.image._path} />
        <CallToAction item={item} />
    </div>
}
function Description({item}) {
    if (item && item.description && item.description.html) return <>
        <div className="description" dangerouslySetInnerHTML={{__html: item.description.html}} data-aue-prop="description" data-aue-type="text" data-aue-label="Description"></div>
    </>
}

function CallToAction({item}) {
    if (item.action && item.callToAction) return <>
        <a className="action" href={item.action} target="_blank" data-aue-prop="callToAction" data-aue-type="text" data-aue-label="Call To Action">{item.callToAction}</a>
    </>
}

// https://author-p91256-e801658.adobeaemcloud.com/graphql/execute.json/dfsite/getM09CarouselByPath