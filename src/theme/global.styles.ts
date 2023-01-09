import { darken, lighten } from 'polished';
import styled, { createGlobalStyle, css } from 'styled-components';

import { ThemeType } from './';
import { headerHeight, layoutTopBottomPadding } from './variables';

/**
 * http://meyerweb.com/eric/tools/css/reset/
 * v2.0 | 20110126
 * License: none (public domain)
*/
/* https://gist.github.com/MoOx/9137295 */
export const GlobalStyle = createGlobalStyle<{ theme: ThemeType }>`
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
    box-sizing: border-box;
  }

  article, aside, details, figcaption, figure, 
  footer, header, hgroup, menu, nav, section {
    display: block;
  }

  ol, ul {
    list-style: none;
  }

  blockquote, q {
    quotes: none;
  }

  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  body {
    line-height: 1;
    font-family: ${({ theme }) => theme.font.family};
    font-size: ${({ theme }) => theme.font.size};
    color: ${({ theme }) => theme.colors.black};
    background-color: ${({ theme }) => theme.colors.grey};
  }

  a {
    color: inherit !important;
    text-decoration: inherit;
  }

  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }

  /* React bootstrap below */
  .btn {
    font-size: 14px;
    font-weight: 600;
    border: 0;
    color: ${({ theme }) => theme.colors.white};

    &:focus,
    &:focus-visible { 
      outline: 0 !important;
    }
  }

  .btn-outline-secondary {
    background-color: ${({ theme }) => darken(0.7, theme.colors.grey)};

    &:hover,
    &:active,
    &:focus {
      background-color: ${({ theme }) => darken(0.9, theme.colors.grey)};
    }
  }

  .btn-primary {
    background-color: ${({ theme }) => darken(0.5, theme.colors.sky)};

    &:hover,
    &:active,
    &:focus {
      background-color: ${({ theme }) => darken(0.7, theme.colors.sky)};
    }
  }

  .btn-danger {
    background-color: ${({ theme }) => theme.colors.rust};

    &:hover,
    &:active,
    &:focus {
      background-color: ${({ theme }) => darken(0.05, theme.colors.rust)};
    }
  }

  .btn-success {
    background-color: ${({ theme }) => theme.colors.pine};

    &:hover,
    &:active,
    &:focus {
      background-color: ${({ theme }) => darken(0.05, theme.colors.pine)};
    }
  }

  .btn-info {
    background-color: ${({ theme }) => darken(0.5, theme.colors.grey)};

    &:hover,
    &:active,
    &:focus {
      background-color: ${({ theme }) => darken(0.7, theme.colors.grey)};
    }
  }

  .form-label {
    font-size: 10px;
    text-transform: uppercase;
    font-weight: 600;
  }

  .was-validated .form-control:valid {
    background-image: none;
    border-color: ${({ theme }) => lighten(0.5, theme.colors.pine)};
  }
  
  .was-validated .form-control:invalid {
    background-image: none;
    border-color: ${({ theme }) => theme.colors.rust};
  }

  .form-control.is-invalid {
    background-image: none;
    border-color: ${({ theme }) => theme.colors.rust};
  }

  .invalid-feedback {
    color: ${({ theme }) => theme.colors.rust};
    font-size: 12px;
  }

  .modal-content {
    padding: 60px 50px;
    border: 0;
  }

  .progress {
    height: 8px;
  }

  .bg-success {
    background-color: ${({ theme }) => theme.colors.pine} !important;
  }

  .bg-danger {
    background-color: ${({ theme }) => theme.colors.rust} !important;
  }
`;

/* Use this when in logged in context */
export const PageWrapper = styled.div`
  width: 100%;
  padding-top: ${headerHeight};
  min-height: 100vh;
`;

export const GenericPageLayout = styled.div<{ isLoading?: boolean, disablePadding?: boolean }>`
  position: relative;

  ${({ disablePadding }) => !disablePadding && css`
    padding: ${layoutTopBottomPadding} 60px;
  `};

  ${({ isLoading }) => isLoading && css`
    opacity: 0.7;
    pointer-events: none;
  `};
`;

export const GenericHeadSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  height: 35px;
`;

export const GenericTitle = styled.h1`
  font-size: 25px;
`;
