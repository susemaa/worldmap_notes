'use client';

import React, { useState } from 'react';
import { parsePath } from 'path-data-parser';
import {
  worldParts, jsxpaths, CountryCode, WorldPart, getCountryCode,
} from '@/utils';

interface WorldMapProps {
  className?: string;
}

export default function WorldMap({ className = '' }: WorldMapProps) {
  const [hovered, setHoveredPart] = useState<WorldPart | null>(null);
  const [viewBox, setViewBox] = useState<string>('0 0 2000 857');

  const [focused, setFocused] = useState<{
    style: { scale: number, x: number, y: number },
    worldPart: WorldPart | null}
    >({
      style: { scale: 1, x: 0, y: 0 },
      worldPart: null,
    });

  const handleMouseEnter = (event: React.MouseEvent<SVGElement, MouseEvent>) => {
    const countryCode: CountryCode = getCountryCode(
      event.currentTarget.id as CountryCode,
      event.currentTarget.classList.value,
    );
    const foundPart: WorldPart | null = (Object.keys(worldParts) as WorldPart[])
      .find((part) => worldParts[part].includes(countryCode))
      || null;
    setHoveredPart(foundPart);
  };

  const handleMouseLeave = () => {
    setHoveredPart(null);
  };

  const handleZoom = (El: React.JSX.Element) => {
    console.log(El);
    const mapWorldPart: {[as in WorldPart]: { scale: number, x: number, y: number }} = {
      Africa: { scale: 1, x: 0, y: 0 },
      Asia: { scale: 1, x: 0, y: 0 },
      Europe: { scale: 1, x: 0, y: 0 },
      NorthAmerica: { scale: 1, x: 0, y: 0 },
      SouthAmerica: { scale: 1, x: 0, y: 0 },
      Oceania: { scale: 1, x: 0, y: 0 },
    };
    setFocused({
      style: hovered ? mapWorldPart[hovered] : { scale: 1, x: 0, y: 0 },
      worldPart: hovered,
    });
    // const countryPaths = jsxpaths.filter();
    const segments = parsePath(El.props.d);
    console.log(El.props.d, segments);
    const {
      xmin, xmax, ymin, ymax,
    } = segments.reduce((acc, segment) => {
      if (segment.data.length === 2) {
        const { key, data } = segment;

        const [pointX, pointY] = key === key.toUpperCase()
          ? [data[0], data[1]] // M L C... - absolute
          : [data[0] + acc.currentX, data[1] + acc.currentY]; // l c... - relative

        acc.xmin = Math.min(acc.xmin, pointX);
        acc.xmax = Math.max(acc.xmax, pointX);
        acc.ymin = Math.min(acc.ymin, pointY);
        acc.ymax = Math.max(acc.ymax, pointY);
        acc.currentX = pointX;
        acc.currentY = pointY;
      }

      return acc;
    }, {
      xmin: Infinity, xmax: -Infinity, ymin: Infinity, ymax: -Infinity, currentX: 0, currentY: 0,
    });

    console.log({
      xmin, xmax, ymin, ymax,
    });

    const width = xmax - xmin;
    const height = ymax - ymin;

    // const viewBoxValue = `${xmin} ${ymin} ${width ? width : xmax} ${height ? height : ymax}`;
    const viewBoxValue = `${xmin} ${ymin} ${width} ${height}`;
    setViewBox(viewBoxValue);
  };

  return (
    <>
      {(hovered || focused.worldPart) && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white my-shadow rounded-lg p-4 animate-fadeIn z-50">
          {hovered || focused.worldPart}
        </div>
      )}
      {/* {focused.worldPart && (
        <button
          className="absolute top-0 right-0 m-4 opacity-50 hover:opacity-100"
          onClick={() => ()}>
          X
        </button>
      )} */}
      <svg
        baseProfile="tiny"
        fill="#c6c6c6"
        height="857"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth=".2"
        version="1.2"
        // viewBox="0 0 2000 857"
        viewBox={viewBox}
        width="2000"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{
          transform: `scale(${focused.style.scale}) translate(${focused.style.x}%, ${focused.style.y}%)`,
          transition: 'transform 0.5s ease-in-out',
        }}
      >
        {jsxpaths.map((El: React.JSX.Element, id: number) => {
          const countryCode: CountryCode = getCountryCode(El.props.id, El.props.className);
          const worldPart: WorldPart | undefined = (Object.keys(worldParts) as WorldPart[]).find((wp) => worldParts[wp].includes(countryCode));
          const isHovered = (focused.worldPart === worldPart) || (hovered && worldParts[hovered].includes(countryCode));
          return React.cloneElement(El, {
            key: `${countryCode}${id}`,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: () => handleZoom(El),
            style: {
              ...El.props.style,
              fill: isHovered ? '#f9f9f9' : '',
              transition: 'fill 0.5s',
            },
          });
        })}
      </svg>
    </>
  );
}
