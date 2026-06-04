import type { ImgHTMLAttributes } from 'react';
import src from './error-403.svg';

const Error403 = (props: ImgHTMLAttributes<HTMLImageElement>) => (
  <img src={src} alt="403 – Forbidden" {...props} />
);

export default Error403;
