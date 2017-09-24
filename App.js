import React from 'react';
import {
  TouchableWithoutFeedback, TouchableOpacity, Text,
  View, Image, StatusBar, ScrollView, Picker, TextInput, Button
} from 'react-native';
import DataProvider from './lib/dataProviders/dataProvider.js'
import Dimensions from 'Dimensions'
import { styles } from './styles/main.js'
export default class App extends React.Component {
  constructor(props) {
    super(props);
    const d = new Date();
    this.state = {
      isLoading: true,
      dateYear: d.getUTCFullYear(),
      dateMonth: d.getMonth() + 1,
      dateDay: d.getDate(),
      dim: Dimensions,
      getData: new DataProvider().getData,

    }
  }

  dateStuff() {
    const newDay = Number(this.state.dateDay) - 1;
    if (newDay <= 0) {
      this.setState({
        dateDay: 30,
        dateMonth: Number(this.state.dateMonth) - 1,
      })
    } else {
      this.setState({
        dateDay: newDay,
      })
    }
  }
  componentDidMount() {
    this.fetchFromApi();
  }
  componentWillUpdate() {
  }
  imageStyles = () => {
    return {
      width: this.state.width,
      height: this.state.height
    }
  }
  fetchFromApi() {
    this.setState({
      isLoading: true
    });
    const state = this.state;
    this.state.getData(state)
      .then(data => {
        // this.dateStuff();
        this.setState({
          apod: data,
          isLoading: false
        })
        if (this.state.apod.media_type === 'video') {
          this.fetchFromApi();
        }
        console.log('data', this.state.apod);
      })
      .catch(err => {
        console.log(err);
      })
  }
  onLayout = () => {
    const { width, height } = this.state.dim.get('window')
    const orientation = width > height ? 'horizontal' : 'vertical';
    if (orientation === 'horizontal') {

    }
    this.setState({
      width: width,
      height: height / 2,
      orientation: orientation
    });
  }
  render() {
    if (!this.state.isLoading) {
      return (
        <ScrollView onLayout={this.onLayout} style={styles.container}>
          <StatusBar hidden={true} />
          <Text style={styles.titleText}>{this.state.apod.title}</Text>

          <View style={{ flex: 1, flexDirection: 'row' }}>
            <StatusBar hidden={true} />
            <TextInput value={this.state.dateYear.toString()} onChangeText={(value) => { this.setState({ dateYear: value }) }} underlineColorAndroid='transparent' placeholder='YEAR' style={styles.datePickerYear} keyboardType='numeric' maxLength={4} />
            <TextInput value={this.state.dateMonth.toString()} onChangeText={(value) => { this.setState({ dateMonth: value }) }} underlineColorAndroid='transparent' placeholder='MON' style={styles.datePickerMonth} keyboardType='numeric' maxLength={2} />
            <TextInput value={this.state.dateDay.toString()} onChangeText={(value) => { this.setState({ dateDay: value }) }} underlineColorAndroid='transparent' placeholder='DAY' style={styles.datePickerDay} keyboardType='numeric' maxLength={2} />
            <TouchableOpacity onPress={() => this.fetchFromApi()} style={styles.button}>
              <Text style={styles.dateButtonText}>GET</Text>
            </TouchableOpacity>
          </View>


          <TouchableWithoutFeedback onLongPress={() => {
            console.log('clicked')
            this.dateStuff();
            this.fetchFromApi();
          }}>
            <Image resizeMode={'contain'} style={this.imageStyles()} source={{ uri: this.state.apod.url }} />
          </TouchableWithoutFeedback>

          <View style={styles.description}>
            <Text style={styles.descriptionText}>{this.state.apod.explanation}</Text>
          </View>

        </ScrollView>
      );
    } else {
      return (
        <View style={styles.loading}>
          <StatusBar hidden={true} />
          <Image resizeMode={'contain'} style={styles.image} source={require('./Rolling.gif')} />
        </View>
      )
    }
  }
}