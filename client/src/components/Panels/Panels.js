import React, { useState, useEffect, useRef, createRef } from "react";

import * as Styled from "./styles";

const Panels = (props) => {
    const [panels, setPanels] = useState([]);
    const rotated = useRef(props.rotated);
    const containerRef = useRef();
    const setupEventHandlers = useRef(false);

    useEffect(() => {
        rotated.current = props.rotated;
    }, [props.rotated]);

    useEffect(() => {
        let position = 0;
        let min = 0;
        let defaultPanels = [...props.meta];
        for (let panel of defaultPanels) {
            panel.postion = position;
            panel.min = min;
            position += panel.initial;
            min += panel.minSize;
        }

        const reversed = [...defaultPanels].reverse();
        let max = 1;
        for (let panel of reversed) {
            max -= panel.minSize;
            panel.max = max;
        }

        setPanels(
            defaultPanels.map((panel) => ({
                name: panel.name,
                fraction: panel.initial,
                position: panel.postion,
                minSize: panel.minSize,
                min: panel.min,
                max: panel.max,
                resizerRef: createRef(),
            }))
        );
    }, []);

    useEffect(() => {
        if (setupEventHandlers.current || !panels.length) return;
        setupEventHandlers.current = true;

        panels.forEach((panel, resizerI) => {
            if (resizerI === 0) return;

            panel.resizerRef.current.addEventListener("mousedown", (event) => {
                event.preventDefault();

                const offsetPos = rotated.current ? event.clientY : event.clientX;
                const resizerPos = rotated.current
                    ? panel.resizerRef.current.getBoundingClientRect().top
                    : panel.resizerRef.current.getBoundingClientRect().left;
                const shiftY = offsetPos - resizerPos;

                const onMouseMove = (event) => {
                    const container = containerRef.current.getBoundingClientRect();
                    let numerator = rotated.current
                        ? event.pageY -
                          shiftY -
                          container.top -
                          window.scrollY -
                          props.resizerSize * resizerI
                        : event.pageX -
                          shiftY -
                          container.left -
                          window.scrollX -
                          props.resizerSize * resizerI;
                    let nominator =
                        (rotated.current ? container.height : container.width) -
                        panels.length * props.resizerSize;

                    let newPos = numerator / nominator;
                    newPos = Math.max(0, newPos);
                    newPos = Math.min(1, newPos);

                    const updated = [...panels];

                    const currentPos = updated[resizerI].position;
                    updated[resizerI].position = Math.min(
                        updated[resizerI].max,
                        Math.max(updated[resizerI].min, newPos)
                    );

                    if (newPos < currentPos) {
                        let cumulative = panels[resizerI - 1].minSize;
                        for (let i = resizerI - 1; i >= 0; i--) {
                            let iPos = updated[i].position;

                            if (iPos < newPos - cumulative) {
                                break;
                            } else {
                                let updatedPosition = newPos - cumulative;
                                updatedPosition = Math.max(updated[i].min, updatedPosition);
                                updatedPosition = Math.min(updated[i].max, updatedPosition);
                                updated[i].position = updatedPosition;
                                cumulative += i <= 0 ? 0 : panels[i - 1].minSize;
                            }
                        }
                    } else {
                        let cumulative = panels[resizerI].minSize;
                        for (let i = resizerI + 1; i < updated.length; i++) {
                            let iPos = updated[i].position;
                            if (iPos > newPos + cumulative) {
                                break;
                            } else {
                                let updatedPosition = newPos + cumulative;
                                updatedPosition = Math.max(updated[i].min, updatedPosition);
                                updatedPosition = Math.min(updated[i].max, updatedPosition);
                                updated[i].position = updatedPosition;
                                cumulative += panels[i].minSize;
                            }
                        }
                    }

                    for (let i = 0, j = 1; i < updated.length; i++, j++) {
                        let iPos = updated[i].position;
                        let jPos = j === updated.length ? 1 : updated[j].position;

                        updated[i].fraction = jPos - iPos;
                    }

                    setPanels(updated);
                };

                const onMouseUp = () => {
                    window.removeEventListener("mousemove", onMouseMove);
                };

                window.addEventListener("mousemove", onMouseMove);
                window.addEventListener("mouseup", onMouseUp);
            });
        });
    }, [panels]);

    return (
        <Styled.Panels $rotated={props.rotated} ref={containerRef}>
            {panels.map((panel, i) => {
                return (
                    <Styled.Panel
                        $rotated={props.rotated}
                        key={i}
                        style={{
                            [props.rotated ? "height" : "width"]: `calc((100% - ${
                                panels.length * props.resizerSize
                            }px) * ${panel.fraction} + ${props.resizerSize}px)`,
                        }}
                    >
                        <Styled.Resizer
                            $size={props.resizerSize}
                            $rotated={props.rotated}
                            ref={panel.resizerRef}
                        >
                            {panel.name}
                        </Styled.Resizer>
                        <Styled.Content>{props.children[i]}</Styled.Content>
                    </Styled.Panel>
                );
            })}
        </Styled.Panels>
    );
};

export default Panels;
