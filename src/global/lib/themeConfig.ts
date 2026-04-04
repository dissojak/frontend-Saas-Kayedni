export interface SliceThemePalette {
  primary: string;
  primaryDark: string;
  accent: string;
  primaryForeground: string;
}

export const SLICE_THEME_CONFIG: Record<string, SliceThemePalette> = {
  generic: {
    primary: '#8A42D8',
    primaryDark: '#512DA8',
    accent: '#E89A6A',
    primaryForeground: '#FFFFFF',
  },
  barber: {
    primary: '#5f720f',
    primaryDark: '#4b5c09',
    accent: '#F1D086',
    primaryForeground: '#FFFFFF',
  },
  'nail-salon': {
    primary: '#EC4899',
    primaryDark: '#BE185D',
    accent: '#FB923C',
    primaryForeground: '#FFFFFF',
  },
  'health&care': {
    primary: '#0EA5A4',
    primaryDark: '#0F766E',
    accent: '#38BDF8',
    primaryForeground: '#FFFFFF',
  },
  'beauty&hairstyling': {
    primary: '#EB77A6',
    primaryDark: '#E23D80',
    accent: '#6160B0',
    primaryForeground: '#FFFFFF',
  },
};
