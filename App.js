/* global global */

import React, { cloneElement, Component } from 'react';

import {
  View,
  Text,
  AsyncStorage,
} from 'react-native';

import { Provider } from 'react-redux';
import createStore from './source/Store.js';
const store = createStore();

import Router from './source/Router.js';
import { persistStore } from 'redux-persist';

export default class index extends Component {
  constructor(props){
    super(props);

    this.state = {
      rehydrated: false,
    };
  }

  componentWillMount() {
    const config = {
      storage: AsyncStorage,
      blacklist: ['router'],
    };

    persistStore(store, config, () => {
      this.setState({rehydrated: true});
    });
  }

  render() {
    if (!this.state.rehydrated)
      return null;
    else
      return (
        <Provider store={store}>
          <Router/>
        </Provider>
      );
  }
}
