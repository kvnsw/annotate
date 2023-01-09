import { lighten } from 'polished';
import { css } from 'styled-components';

// From https://blog.sonos.com/en-us/sonos-brand-design-refresh
const theme = {
  font: {
    family: 'Helvetica, Arial, sans-serif',
    size: '16px',
  },
  colors: {
    black: lighten(0.12, '#231f20'),
    grey: lighten(0.12, '#d8d8d8'),
    white: '#fff',
    rust: '#bb4724',
    rose: '#f1d9d8',
    sand: '#d7a157',
    sky: '#bdd1e7',
    pine: '#1d5f4b',
  },
  helpers: {
    textEllipsis: css`
      /** We need to specify a line-height >= 1.3 otherwise letters like 'g' or 'y' are truncated */
      line-height: 1.3;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `,
  },
};

export type ThemeType = typeof theme;
export default theme;
