import { useEffect, useState } from 'react';
import './Quote.css'

// http://localhost:3000/preview/m10quote?param=${contentFragment.path}

const DOMAIN = 'https://publish-p91256-e801658.adobeaemcloud.com';



export default function Quote() {
    const [path, setPath] = useState('');
    const [variations, setVariations] = useState([])
    
    const variations_endpoint = '/graphql/execute.json/dfsite/m10QuoteVariarionsByPath';

    useEffect(() => {
        let queryParameters = new URLSearchParams(window.location.search)
        setPath(queryParameters.get("param") || '');
    }, []);

    useEffect(() => {
        if (!path && path.length === 0) return; 
        var url = DOMAIN + variations_endpoint + ';path=' + path;
        url += ';d=' + Math.round(Math.random()*100000000)
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (!data.data) return;
                let quote = data.data.m10QuoteByPath.item;
                setVariations(quote._variations)
            });
    }, [path])

    return <>
        <div className="header">
            <h1>M10 Quote</h1>
            <h2>Path: {path}</h2>
            <p><a href="http://ee-style-guide.s3-website-eu-west-1.amazonaws.com/section/12.10" target="_blanl">EE Styleguide M10 Quote</a></p>
        </div>
        <h3 className="cfTitle">Main variation</h3>
       <QuoteDisplay2 path={path} />
       
       { variations.map((variation) => <>
            <h3 className="cfTitle">{variation}</h3>
            <QuoteDisplay2 path={path} variation={variation} />
        </>
       )}
       <p><br /></p>
    </>
}

function QuoteDisplay2({path, variation}) {
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [quote, setQuote] = useState('');
    const [image, setImage] = useState('');

    const QUOTE_ENDPOINT = '/graphql/execute.json/dfsite/m10QuoteByPath';

    useEffect(() => {
        if (!path && path.length === 0) return; 
        var url = DOMAIN + QUOTE_ENDPOINT + ';path=' + path;
        if (variation) url += ';variation=' + variation;
        url += ';d=' + Math.round(Math.random()*100000000)
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (!data.data) return;
                let quote = data.data.m10QuoteByPath.item;
                setName(quote.name || '')
                setTitle(quote.title || '')
                setQuote(quote.quote ? quote.quote.html : '')
                setImage(quote.image ? quote.image._dynamicUrl : '')
            });
    }, [path, variation])

    return  <div className="quote">
        <Image image={image} />
        <div className="text" dangerouslySetInnerHTML={{__html: quote}}></div>
        <p className='name'>{name}</p>
        <p className='title'>{title}</p>
    </div>
}


function Image({image}) {
    if (image) return <div className='image'>
            <img src={DOMAIN + image} />
        </div>
}