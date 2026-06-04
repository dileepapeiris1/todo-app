import type { ImgHTMLAttributes } from 'react';
import src from './error-401.svg';

const Error401 = (props: ImgHTMLAttributes<HTMLImageElement>) => (
  <img src={src} alt="401 – Unauthorized" {...props} />
);

export default Error401;
