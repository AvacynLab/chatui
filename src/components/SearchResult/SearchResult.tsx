import React from 'react';
import { Search } from '../../types/responses';
import './SearchResult.scss';

interface SearchResultProps {
  search: Search;
}

const SearchResult: React.FC<SearchResultProps> = ({ search }) => {
  return (
    <div className="search-result">
      <h3>{search.title}</h3>
      {search.datablock.map((block, index) => (
        <div key={index} className="datablock">
          <h4>{block.h1}</h4>
          {block.h2.map((h2, h2Index) => (
            <div key={h2Index}>
              <h5>{h2}</h5>
              <p>{block.p[h2Index]}</p>
            </div>
          ))}
        </div>
      ))}
      <div className="sources">
        <h4>Sources:</h4>
        <ul>
          {search.sources.map((source, index) => (
            <li key={index}>{source}</li>
          ))}
        </ul>
      </div>
      <div className="questions">
        <h4>Questions supplémentaires:</h4>
        <ul>
          {search.questions.map((question, index) => (
            <li key={index}>{question}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchResult;
