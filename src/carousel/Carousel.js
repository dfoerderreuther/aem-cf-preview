import React, { useEffect, useState } from "react";
import './Carousel.css'

const DOMAIN = 'https://publish-p91256-e801658.adobeaemcloud.com';
const CAROUSEL_ENDPOINT = '/graphql/execute.json/dfsite/m09CarouselByPath';

export default function Carousel() {
    const [path, setPath] = useState('');
    const [style, setStyle] = useState('');
    const [items, setItems] = useState([]);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        let queryParameters = new URLSearchParams(window.location.search)
        setPath(queryParameters.get("param") || '');
    }, []);

    useEffect(() => {
        if (!path && path.length === 0) return; 
        fetch(DOMAIN + CAROUSEL_ENDPOINT + ';path=' + path + ';d=' + Math.round(Math.random()*100000000))
            .then(response => response.json())
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
    
    return <>
        <div className="header">
            <h1>M09 Carousel</h1>
            <h2>Path: {path}</h2>
            <p><a href="http://ee-style-guide.s3-website-eu-west-1.amazonaws.com/section/12.09" target="_blanl">EE Styleguide M09 Carousel</a></p>
        </div>
        <div className={"Carousel " + style}>
            <button className="btn lft" onClick={actionPrevious}>&lt;</button>
            <Item item={items[current]} />
            <button className="btn rgt" onClick={actionNext}>&gt;</button>
        </div>
    </>;
}

function Item({item}) {
    if (!item || !item.hasOwnProperty('title') || !item.hasOwnProperty('image')) return <></>
    console.log('item', item)
    return <div className="item">
        <div className="text">
            <div className="inner">
                <h3>{item.title}</h3>
                <Description item={item} /> 
                
            </div>    
        </div>
        <img src={DOMAIN + item.image._path} />
        <CallToAction item={item} />
    </div>
}
function Description({item}) {
    if (item && item.description && item.description.html) return <>
        <div className="description" dangerouslySetInnerHTML={{__html: item.description.html}}></div>
    </>
}

function CallToAction({item}) {
    if (item.action && item.callToAction) return <>
        <a className="action" href={item.action} target="_blank">{item.callToAction}</a>
    </>
}

// https://author-p91256-e801658.adobeaemcloud.com/graphql/execute.json/dfsite/getM09CarouselByPath