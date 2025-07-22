import { useEffect, useState } from 'react';
import './Quote.css'
import AEMHeadless from '@adobe/aem-headless-client-js';

// http://localhost:3000/preview/m10quote?param=${contentFragment.path}

const DOMAIN = 'https://publish-p91256-e801658.adobeaemcloud.com';
const ENDPOINT = '/graphql/execute.json';

export default function Quote() {
    const [path, setPath] = useState('');
    const [variations, setVariations] = useState([])
    

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
          aemHeadlessClient.runPersistedQuery('dfsite/m10QuoteVariarionsByPath', {
            'path': path, 
            'd': Math.round(Math.random()*100000000)
          })
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

    const aemHeadlessClient = new AEMHeadless({
        serviceURL: DOMAIN,
        endpoint: ENDPOINT
    })

    useEffect(() => {
        if (!path && path.length === 0) return; 

        aemHeadlessClient.runPersistedQuery('dfsite/m10QuoteByPath', {
            'path': path, 
            'variation': variation, 
            'd': Math.round(Math.random()*100000000)
          })
            .then(data => {
                if (!data.data) return;
                let quote = data.data.m10QuoteByPath.item;
                setName(quote.name || '')
                setTitle(quote.title || '')
                setQuote(quote.quote ? quote.quote.html : '')
                setImage(quote.image ? quote.image._dynamicUrl : '')
            });
    }, [path, variation])


	const editorProps = {
		"data-aue-resource": "urn:aemconnection:" + path + "/jcr:content/data/" + (variation ? variation : "master"),
		"data-aue-type": "reference",
		itemfilter: "cf"
	};

    return  <div className="quote" {...editorProps} >
        <Image image={image} />
        <div className="text" dangerouslySetInnerHTML={{__html: quote}} data-aue-prop="quote" data-aue-type="text" data-aue-label="Quote"></div>
        <p className='name' data-aue-prop="name" data-aue-type="text" data-aue-label="Name">{name}</p>
        <p className='title' data-aue-prop="title" data-aue-type="text" data-aue-label="Title">{title}</p>
    </div>
}


function Image({image}) {
    if (image) return <div className='image'>
            <img src={DOMAIN + image} />
        </div>
}