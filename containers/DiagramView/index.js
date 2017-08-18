import React from 'react';
import { StyleSheet, Navigator, PanResponder, Dimensions, Animated, TouchableHighlight, Image, View } from 'react-native';
import { Container, Header, Button, Icon, Text } from 'native-base';
import { response } from './json.js';
import * as Animatable from 'react-native-animatable';

const bottomArrow = require('./BottomArrow.png');
const topArrow = require('./TopArrow.png');

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

export default class DiagramView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            diagramElements: this.findDiagramElements('Activity'),
            lines: [],
            slideNumber: 0,
            slidePath: [],
        }
    }

    findDiagramElements = (name) => {
        const tempArray = [];
        response.DiagramElement.map((value, key) => {
            const elementName = Object.keys(value)[0];
            if (elementName === name) {
                tempArray.push(value.Activity);
            }
        });
        return this.sortDiagramElements(tempArray);
    }

    sortDiagramElements = (elements) => elements.sort(this.sortById);

    sortById = (a, b) => Number(a['xmi.id'].match(/\d+/)[0]) - Number(b['xmi.id'].match(/\d+/)[0]);

    onSwipeLeft = () => {
        if (this.state.slideNumber !== 0) {
            this.setState({ slideNumber: this.state.slideNumber - 1 });
            this.refs.view.fadeInLeft().then((endState) => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));            
        }
    }

    onSwipeRight = () => {
        if (this.state.slideNumber !== this.state.diagramElements.length-1) {
            this.setState({ slideNumber: this.state.slideNumber + 1 });
            this.refs.view.fadeInRight().then((endState) => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));
        }
    }

    filterArrows = (array) => ({
        inArrows: array.filter(value => value.type === 'in'),
        outArrows: array.filter(value => value.type === 'out'),
    })

    generateTopArrows = (arrows) => 
        arrows.map((value, key) => (
        <Button onPress={this.onSwipeLeft} key={key} bordered dark iconLeft full style={styles.arrowButton}>
                {this.state.slideNumber !== 0 && <Icon name='ios-arrow-round-back-outline' />}
            <Text>{value.data.name}</Text>
        </Button>))
   
    generateBottomArrows = (arrows) => 
        arrows.map((value, key) => (
        <Button onPress={this.onSwipeRight} key={key} bordered dark iconRight full>
            <Text>{value.data.name}</Text>
            {this.state.slideNumber !== this.state.diagramElements.length - 1 && <Icon name='ios-arrow-round-forward-outline' />}
        </Button>))

    getResourceName = (info) => {
        if (Array.isArray(info)) {
            return info.map((value, key) => <View key={key} style={styles.bottomTextContainer}><Text style={styles.bottomText}>{value['CONTROL:ResName']}</Text></View>)
        } else {
            return <View style={styles.bottomTextContainer}><Text style={styles.bottomText}>{info.ResName}</Text></View>;
        }
    }

    userSlide = (evt) => {
        const tempSlidePath = this.state.slidePath;
        tempSlidePath.push(evt.nativeEvent.locationX);
        this.setState({
            slidePath: tempSlidePath,
        });
    }

    slideFinished = () => {
        this.checkSlideSide();
        this.setState({
            slidePath: [],
        });
    }

    checkSlideSide = () => {
        const path = this.state.slidePath;
        if (path.length) {
            const slide = path[0] - path[path.length-1];
            slide > 0 ? this.onSwipeRight() : this.onSwipeLeft();
        }
    }

    render() {
        const currentSlide = this.state.diagramElements[this.state.slideNumber];
        const arrows = this.filterArrows(this.state.diagramElements[this.state.slideNumber].lines);
        
        return (
            <Container>
                <Animatable.View ref = "view" style={styles.container}>
                    {this.generateTopArrows(arrows.inArrows)}
                    <View
                        onStartShouldSetResponder={evt => true}
                        style={styles.tileContainer}
                        onMoveShouldSetResponder={evt => true}
                        onResponderMove={this.userSlide}
                        onResponderRelease={this.slideFinished}
                    >
                        <View style={styles.mainTileTextContainer}><Text style={styles.mainTileText}>{currentSlide.name}</Text></View>
                        {this.getResourceName(currentSlide.RequiredResource)}
                    </View>
                    {this.generateBottomArrows(arrows.outArrows)}
                </Animatable.View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginHorizontal: 10,
        marginVertical: 10,
    },
    arrowContainer: {
        flex: 1,
    },
    tileContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#EAEBF0',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#000',
        marginTop: 5,
        marginBottom: 5,
    },
    mainTileTextContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainTileText: {
        textAlign: 'center',
    },
    bottomTextContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#6B7A96',
        borderBottomWidth: 1,
        borderBottomColor: '#fff'
    },
    bottomText: {
        justifyContent: 'center',
        textAlign: 'center',
        color: "#fff",
    },
    bottomArrow: {
        alignItems: 'flex-end',
    },
    topArrow: {
        justifyContent: 'flex-end',
        flex: 1,
    },
    arrowButton: {
        height: 'auto',
    }

});


