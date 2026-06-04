import type { ImgHTMLAttributes } from 'react';
import src from './error-404.svg';

const Error404 = (props: ImgHTMLAttributes<HTMLImageElement>) => (
  <img src={src} alt="404 – Not Found" {...props} />
);

export default Error404;
