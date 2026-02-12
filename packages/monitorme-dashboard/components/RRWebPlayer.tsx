import React, { useState, useEffect, useRef } from "react";
import RrwebPlayer, { RRwebPlayerOptions } from "rrweb-player";
import "rrweb-player/dist/style.css";

const RRWebPlayer = ({ events }: any) => {
  const wrapper = useRef<HTMLDivElement | null>(null);
  const calledRef = useRef<boolean>(false);

  useEffect(() => {
    if (events?.length > 1 && wrapper.current && !calledRef.current) {
      new RrwebPlayer({
        target: wrapper.current,
        props: {
          events,
        },
      } as RRwebPlayerOptions);
      calledRef.current = true;
    }
  }, [events]);

  if (events?.length < 2) return <p>Loading...</p>;

  return (
    <div>
      <div ref={wrapper} />
    </div>
  );
};

export default RRWebPlayer;
