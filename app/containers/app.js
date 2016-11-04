import React, { Component } from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { View } from 'react-native';

import Reactotron from 'reactotron-react-native';
import createReactotronEnhancer from 'reactotron-redux';

import * as reducers from '../reducers';
import HouseControlApp from './houseControlApp';

const reactotronEnhancer = createReactotronEnhancer(Reactotron)
const reducer = combineReducers(reducers);
const store   = createStore(reducer, reactotronEnhancer);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <HouseControlApp />
      </Provider>
    );
  }
}
