import React from 'react';
import { useSetState } from 'ahooks';
import placeholder from 'static/images/placeholder.jpg';
import styles from './index.less';

const images: HTMLImageElement[] = [];

interface ILazyImageProps {
  src: string;
  mode: 'img' | 'bgi';
  width?: number | string;
  height?: number | string;
}
const LazyImage = (props: ILazyImageProps) => {
  const { src, width = '100%', height = '100%' } = props;

  const [state, setState] = useSetState({
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  });

  return (
    <div
      className="lazy-img"
      style={{
        width: state.width,
        height: state.height,
      }}
    >
      <img src={placeholder} data-src={src} />
    </div>
  );
};
