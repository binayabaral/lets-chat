import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false
};

export const theme = extendTheme(
  { config },
  {
    colors: {
      brand: {
        100: '#006000',
        200: '#008000'
      }
    },
    styles: {
      global: () => {
        body: {
          bg: 'whiteAlpha.200';
        }
      }
    }
  }
);
