import type { ImgHTMLAttributes } from 'react';

type PublicImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string;
};

export const PublicImage = ({ src, ...props }: PublicImageProps) => {
  return <img src={`${import.meta.env.BASE_URL}${src}`} {...props} />;
};
