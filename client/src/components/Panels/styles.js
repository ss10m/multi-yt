import styled, { css } from "styled-components";

export const Panels = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    overflow: auto;

    ${(props) =>
        props.$rotated &&
        css`
            flex-direction: column;
        `}
`;

export const Panel = styled.div`
    display: flex;
    flex-direction: row;
    overflow: hidden;

    ${(props) =>
        props.$rotated &&
        css`
            flex-direction: column;
        `}
`;

export const Resizer = styled.div`
    flex-shrink: 0;
    width: ${(props) => `${props.$size}px`};
    line-height: ${(props) => `${props.$size}px`};
    padding-top: 10px;
    border-left: 1px solid rgba(255, 255, 255, 0.05);
    border-right: 1px solid rgba(0, 0, 0, 0.4);
    background-color: #333642;
    color: #aaaebc;
    cursor: col-resize;
    writing-mode: vertical-rl;
    text-transform: uppercase;
    font-family: "Lato", "Lucida Grande", "Lucida Sans Unicode", Tahoma, Sans-Serif;
    font-size: 13px;
    font-weight: bold;

    ${Panel}:first-of-type & {
        cursor: auto;
    }

    ${(props) =>
        props.$rotated &&
        css`
            width: 100%;
            height: ${(props) => `${props.$size}px`};
            padding: 0;
            padding-left: 10px;
            border: none;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            border-bottom: 1px solid rgba(0, 0, 0, 0.4);
            writing-mode: horizontal-tb;
            cursor: row-resize;
        `}
`;

export const Content = styled.div`
    flex: 1;
    overflow: auto;
    background: #242b5e;

    &::-webkit-scrollbar {
        width: 7px;
        height: 7px;
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 2px;
        background-color: #aaaebc;
    }

    &::-webkit-scrollbar-corner {
        background-color: #242b5e;
    }
`;
