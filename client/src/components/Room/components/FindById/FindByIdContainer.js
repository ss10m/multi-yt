// Libraries & utils
import React, { useState } from "react";

export default ({ playVideo }) => {
    const [url, setUrl] = useState("");

    const onChange = (event) => {
        setUrl(event.target.value);
    };

    const onClick = () => {
        if (!url) return;
        const idRegEx = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/;
        const match = url.match(idRegEx);
        const id = match && match[2] ? match[2] : url;
        playVideo({ id });
    };

    return (
        <>
            <div>ENTER YOUTUBE URL OR VIDEO ID</div>
            <input value={url} onChange={onChange} autoFocus />
            <button onClick={onClick}>PLAY</button>
        </>
    );
};
