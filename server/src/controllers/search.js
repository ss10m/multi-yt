import axios from "axios";
import { API_KEY } from "../config/credentials.js";

export const search = async (query, cb) => {
    const videos = await fetchVideos(query);
    if (!videos || !videos.length) return cb([]);
    const videoIdToDetails = await fetchVideoDetails(videos);
    if (!videoIdToDetails || !Object.keys(videoIdToDetails).length) return cb([]);
    const results = parseData(videos, videoIdToDetails);
    cb(results);
};

const fetchVideos = async (query) => {
    try {
        let options = {
            method: "get",
            url: `https://www.googleapis.com/youtube/v3/search`,
            params: {
                part: "snippet",
                maxResults: 10,
                type: "video",
                q: query,
                key: API_KEY,
            },
        };

        const response = await axios(options);
        if (response && response.status != "200") {
            return null;
        }

        return response.data.items;
    } catch (err) {
        return null;
    }
};

const fetchVideoDetails = async (videos) => {
    const ids = videos.map((video) => video.id.videoId).join(",");

    try {
        let options = {
            method: "get",
            url: `https://www.googleapis.com/youtube/v3/videos`,
            params: {
                part: "contentDetails,statistics",
                id: ids,
                key: API_KEY,
            },
        };
        let response = await axios(options);
        if (response && response.status != "200") {
            return null;
        }

        const idToDetails = {};
        for (let video of response.data.items) {
            idToDetails[video.id] = video;
        }
        return idToDetails;
    } catch (err) {
        return null;
    }
};

const parseData = (videos, videoIdToDetails) => {
    let parsed = [];
    for (let video of videos) {
        const details = videoIdToDetails[video.id.videoId];

        if (
            !details ||
            video.id.kind !== "youtube#video" ||
            video.snippet.liveBroadcastContent !== "none"
        ) {
            continue;
        }

        const likes = parseInt(details.statistics.likeCount);
        const dislikes = parseInt(details.statistics.dislikeCount);

        const videoData = {};
        videoData["id"] = video.id.videoId;
        videoData["title"] = video.snippet.title;
        videoData["publishedAt"] = video.snippet.publishedAt;
        videoData["thumbnail"] = video.snippet.thumbnails.medium.url;
        videoData["viewCount"] = details.statistics.viewCount;
        videoData["likeRatio"] = likes / (likes + dislikes);
        videoData["duration"] = details.contentDetails.duration;
        parsed.push(videoData);
    }

    return parsed;
};
