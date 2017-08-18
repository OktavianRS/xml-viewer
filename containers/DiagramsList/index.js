import React from 'react';
import { StyleSheet, View, Navigator } from 'react-native';
import { Container, Header, Content, List, ListItem, Text } from 'native-base';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';


export default class DiagramsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
        }
        this.fetchDiagramsList();
    }

    fetchDiagramsList = () => {
        return axios.get('http://0.0.0.0:8000/resources/Human%20Resources%20(HR)/?format=json')
            .then(response => {
                this.setState({
                    dataList: response.data,
                })
            })
            .catch(error => console.error(error));
    }

    render() {
        console.log(this.state.dataList);
        return (
            <Container>
                <Header />
                <Content>
                    <List>
                        {this.state.dataList.map((value, key) => {
                            return (
                                <ListItem key={key}>
                                    <Text>{value}</Text>
                                </ListItem>);
                        })}
                        <ListItem onPress={() => Actions.diagramView()}>
                            <Text>1.1.1.xml</Text>
                        </ListItem>
                    </List>
                </Content>
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
