import { Image, ImageProps } from 'react-native';


const ThemedLogo = ({ ...props }: ImageProps) => {

  
  return (
    <Image src='../assets/images/APAN.png' {...props} />
  );
};

export default ThemedLogo;