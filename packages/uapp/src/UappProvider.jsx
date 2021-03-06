import React from 'react';
import PropTypes from 'prop-types';
import { Provider as DefaultMobxProvider } from 'mobx-react';
import { ThemeProvider as DefaultThemeProvider } from 'emotion-theming';
import DefaultLinkProvider from '@lskjs/link/LinkProvider';

const UappProvider = ({ uapp, children: rawChildren }) => {
  let children = <>{rawChildren}</>;

  const { MobxProvider } = UappProvider;
  const stores = (uapp && uapp._provide && uapp._provide()) || (uapp && uapp.provide && uapp.provide()) || {};
  if (stores && Object.keys(stores).length && MobxProvider) {
    children = <MobxProvider {...stores}>{children}</MobxProvider>;
  }

  const { LinkProvider } = UappProvider;
  if (uapp && uapp.history && LinkProvider) {
    children = <LinkProvider onClick={url => uapp.history.push(url)}>{children}</LinkProvider>;
  }

  const { ThemeProvider } = UappProvider;
  const { theme } = uapp;
  if (theme && ThemeProvider) {
    children = <ThemeProvider theme={theme}>{children}</ThemeProvider>;
  }

  return children;
};

UappProvider.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  uapp: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};
UappProvider.MobxProvider = DefaultMobxProvider;
UappProvider.ThemeProvider = DefaultThemeProvider;
UappProvider.LinkProvider = DefaultLinkProvider;

export default UappProvider;
