import React from 'react';
import './quotes.css';
import Topbar from '../Topbar';
import '../topbar.css'
const Quotes = () => {
  const quoteText = "Never give up because you never know if the next try is going to be the one that works.";
  const quoteAuthor = "Mary Kay Ash";

  return (
    <>
    <Topbar/>
    <div className="quotes-container">
      <h1>Quotes</h1>
      <p className="subtitle">
        Popular inspirational quotes collected from various sources
      </p>
      <div className="quote-buttons">
        <button className="quotes-btn selected">FAV QUOTES</button>
        <button className="quotes-btn">All QUOTES</button>
      </div>
      <div className="quotes-grid">
        {[1, 2, 3].map((_, idx) => (
          <div key={idx} className="quote-card">
            <h2>Assasins Creed</h2>
            <p className="quote-text">❝ {quoteText} ❞</p>
            <p className="quote-author">— {quoteAuthor}</p>
            <div className="quote-controls">
              <div className="circle-icons">
                <span>◀</span>
                <span>⏺</span>
                <span>▶</span>
              </div>
              <button className="new-quote-btn">New Quote</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Quotes;
