import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  StackNavigator,
} from 'react-navigation';

import FolderSelectionScreen from './FolderSelectionScreen.js';

export const Router = StackNavigator(
  {
    FolderSelection: {screen: FolderSelectionScreen},
  }, {headerMode: () => null}
);

import { addNavigationHelpers } from 'react-navigation';

import {
  View,
  StatusBar,
} from 'react-native';

// import {
//   Colors,
// } from './components';

@connect(
  ({ router }) => ({
    nav: router
  })
)
export default class App extends Component {
  render() {
    return (
      <View style={{flex:1, // backgroundColor: Colors.Primary
            }}>
        <Router
          navigation={addNavigationHelpers({
            dispatch: this.props.dispatch,
            state: this.props.nav
          })}/>
      </View>
    );
  }
};
