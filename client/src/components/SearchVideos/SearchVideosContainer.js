// Libraries & utils
import React from "react";
import { debounce } from "lodash";

// Componenets
import SearchVideos from "./SearchVideos";

// Helpers
import { parseResponse, timeSince, roundedToFixed, parseTitle, parseDuration } from "helpers";

class SearchVideosContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: "",
            searchResults: null,
            isFetching: false,
        };

        this.inputRef = React.createRef();
        this.searchVideos = debounce(this.searchVideos, 800);
    }

    handleChange = (event) => {
        const searchValue = event.target.value;
        const newState = { searchValue, isFetching: true };
        if (!searchValue) {
            newState.searchResults = null;
            newState.isFetching = false;
        }
        this.setState(newState);
        this.searchVideos(searchValue);
    };

    clearInput = () => {
        this.setState({ searchValue: "", searchResults: null, isFetching: false });
        this.inputRef.current.focus();
    };

    searchVideos = async (query) => {
        if (query !== this.state.searchValue || query.length === 0) {
            return;
        }

        const response = await fetch(`/search?query=${query}`);
        const parsed = await parseResponse(response);
        if (!parsed) return this.setState({ searchResults: null, isFetching: false });
        const results = parsed.data;
        if (!results) return this.setState({ searchResults: null, isFetching: false });
        this.cacheImages(results);
    };

    cacheImages = (videos) => {
        if (!videos.length) return this.setState({ searchResults: [], isFetching: false });
        const totalImages = videos.length;
        let cachedImages = 0;

        videos.forEach((video) => {
            video.title = parseTitle(video.title);
            video.publishedAt = timeSince(new Date(video.publishedAt));
            video.viewCount = roundedToFixed(video.viewCount);
            video.duration = parseDuration(video.duration);

            const image = new window.Image();
            image.onload = () => {
                cachedImages++;
                if (cachedImages === totalImages) {
                    this.setState({ searchResults: videos, isFetching: false });
                }
            };
            image.src = video.thumbnail;
        });
    };

    render() {
        const { isFetching, searchValue, searchResults } = this.state;
        return (
            <SearchVideos
                isFetching={isFetching}
                searchValue={searchValue}
                searchResults={searchResults}
                handleChange={this.handleChange}
                clearInput={this.clearInput}
                playVideo={this.props.playVideo}
                ref={this.inputRef}
            />
        );
    }
}

export default SearchVideosContainer;
