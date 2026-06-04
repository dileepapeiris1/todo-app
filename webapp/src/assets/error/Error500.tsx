import type { ImgHTMLAttributes } from 'react';
import src from './error-500.svg';

const Error500 = (props: ImgHTMLAttributes<HTMLImageElement>) => (
  <img src={src} alt="500 – Server Error" {...props} />
);

export default Error500;
