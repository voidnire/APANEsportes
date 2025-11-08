/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    title: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    buttonBackground:'#0197F6',
    buttonBackgroundDisabled:'#A0A0A0',
    buttonBackground2:'#EF5B5B',
    subtitle: '#8A8A8E',
    //card
    cardBackground: '#FFFFFF',
    cardShadow:'#000',
    cardBorder:'#EFEFEF',
    
  },
  dark: {
    text: '#ECEDEE',
    title: '#ffffffff',
    background: '#0B0E19',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    buttonBackground:'#EF5B5B',
    buttonBackgroundDisabled:'#A0A0A0',
    buttonBackground2:'#0197F6',
    subtitle: '#f4f2fcff',
    //card
    cardBackground: '#121820',
    cardShadow:'#000',
    cardBorder:'#0d1116ff',

  },
};