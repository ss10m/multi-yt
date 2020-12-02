// Libraries & utils
import React from "react";
import { debounce } from "lodash";

import SearchVideos from "./SearchVideos";

class SearchVideosContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: "",
        };

        this.searchVideos = debounce(this.searchVideos, 800);
    }

    toggleSearchView = () => {
        this.setState((prevState) => ({ searchView: !prevState.searchView }));
    };

    handleChange = (event) => {
        const searchValue = event.target.value;
        this.setState({ searchValue });
        this.searchVideos(searchValue);
    };

    clearInput = () => {
        this.setState({ searchValue: "" });
    };

    searchVideos = (query) => {
        if (query !== this.state.searchValue || query.length === 0) {
            return;
        }

        console.log(query);
    };

    render() {
        return (
            <SearchVideos
                searchValue={this.state.searchValue}
                handleChange={this.handleChange}
                clearInput={this.clearInput}
            />
        );
    }
}

export default SearchVideosContainer;
