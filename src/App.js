import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes
} from "react-router-dom";
import './App.css'
import Carousel from "./carousel/Carousel";
import Quote from "./quote/Quote";
import { Helmet, HelmetProvider } from "react-helmet-async";


export default function App() {
  return (
    <HelmetProvider>
    <Helmet>
        {/* AEM Universal Editor :: CORE Library
          Loads the LATEST Universal Editor library
        */}
        <script
            src="https://universal-editor-service.adobe.io/cors.js"
            async
        />
        <meta
            name="urn:adobe:aue:system:aemconnection"
            content={'aem:https://author-p91256-e801658.adobeaemcloud.com'}
        />
        

    </Helmet>
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/preview/m09carousel?param=/content/dam/dfsite/btc/iphone-17/iphone-17-product-carousel">M09 Carousel</Link>
            </li>
            <li>
              <Link to="/preview/m10quote?param=/content/dam/dfsite/btc/iphone-17/marks-quote">M10 Quote</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/preview/m09carousel" element={<Carousel />} />
          <Route path="/preview/m10quote" element={<Quote />} />
        </Routes>
      </div>
    </Router>
    </HelmetProvider>
  );
}

function Home() {
  return <div class="header">
      <h1>Home</h1>
      <p>This is an application to offer previous to AEM Content Fragments.</p>
      <p><a href="http://ee-style-guide.s3-website-eu-west-1.amazonaws.com/" target="_blanl">EE Styleguide</a></p>
  </div>;
}


