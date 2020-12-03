// Libraries & utils
import React from "react";
import classNames from "classnames";

// Icons
import { FiSearch } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";

// Componenets
import Spinner from "../Spinner/Spinner";

// SCSS
import "./SearchVideos.scss";

export default React.forwardRef((props, ref) => {
    return (
        <div className="room-search">
            <div className="input-wrapper">
                <div className="icon">
                    <FiSearch />
                </div>
                <input
                    className={classNames({
                        rounded: !props.searchValue,
                    })}
                    type="text"
                    value={props.searchValue}
                    onChange={props.handleChange}
                    spellCheck={false}
                    placeholder="Search"
                    autoComplete="off"
                    ref={ref}
                    autoFocus
                />
                {props.searchValue && (
                    <div className="icon right">
                        <span onClick={props.clearInput}>
                            <FaTimes />
                        </span>
                    </div>
                )}
            </div>
            <SearchResults
                isFetching={props.isFetching}
                searchResults={props.searchResults}
                playVideo={props.playVideo}
            />
        </div>
    );
});

function SearchResults({ isFetching, searchResults, playVideo }) {
    let results;
    if (isFetching) {
        results = (
            <div className="empty">
                <Spinner size="50px" />
            </div>
        );
    } else if (!searchResults) {
        results = null;
    } else if (searchResults.length === 0) {
        results = (
            <div className="empty">
                <p>No matches found</p>
            </div>
        );
    } else {
        results = searchResults.map((result) => (
            <SearchResult result={result} playVideo={playVideo} />
        ));
    }

    return <div className="search-results">{results}</div>;
}

function SearchResult({ result, playVideo }) {
    return (
        <div className="result" onClick={() => playVideo(result.id)}>
            <img width="200px" src={result.thumbnail} />
            <div>{result.title}</div>
        </div>
    );
}
