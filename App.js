import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Container } from 'native-base';
import { Router, Scene, Actions } from 'react-native-router-flux';
import DiagramsList from './containers/DiagramsList';
import DiagramView from './containers/DiagramView';


export default class App extends React.Component {

  render() {
    return (
      <Container>
        <Router>
          <Scene key="root">
            <Scene key="diagramsList" component={DiagramsList} title="List of diagrams" />
            <Scene key="diagramView" component={DiagramView} title="" />
          </Scene>
        </Router>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
