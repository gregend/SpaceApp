import React from 'react';
import {
  TouchableWithoutFeedback, TouchableOpacity, Text,
  View, Image, StatusBar, ScrollView, Picker, TextInput, Button
} from 'react-native';
import Dimensions from 'Dimensions'
import { styles } from './styles/main.js'
export default class App extends React.Component {
  constructor(props) {
    super(props);
    const d = new Date();
    console.log(Dimensions.get('window'))
    this.year = d.getUTCFullYear();
    this.month = d.getMonth() + 1;
    this.day = d.getDate();
    this.state = {
      isLoading: true,
      dateYear: d.getUTCFullYear(),
      dateMonth: d.getMonth() + 1,
      dateDay: d.getDate(),
      height: 100,
      dim: Dimensions
    }
  }

  dateStuff() {
    const newDay = this.state.dateDay - 1;
    if (newDay <= 0) {
      this.setState({
        dateDay: 30,
        dateMonth: this.state.dateMonth - 1,
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

  handleImagePress() {
    if (this.state.height === 100) {
      this.setState({
        height: 500
      })
    }
    else {
      this.setState({
        height: 100
      })
    }

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
    const dateString = state.dateYear + '-' + state.dateMonth + '-' + state.dateDay;
    return fetch('https://api.nasa.gov/planetary/apod?api_key=VOJbRrExRvLUhD8sr90T4FpF4VcYRRIF1G7AhSEu&date=' + dateString)
      .then(data => data.json())
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
            <TextInput defaultValue={this.state.dateYear.toString()} onChangeText={(value) => { this.setState({dateYear: value})}} underlineColorAndroid='transparent' placeholder='YEAR' style={styles.datePickerYear} keyboardType='numeric' maxLength={4} />
            <TextInput defaultValue={this.state.dateMonth.toString()} onChangeText={(value) => { this.setState({dateMonth: value}) }} underlineColorAndroid='transparent' placeholder='MON' style={styles.datePickerMonth} keyboardType='numeric' maxLength={2} />
            <TextInput defaultValue={this.state.dateDay.toString()} onChangeText={(value) => {  this.setState({dateDay: value}) }} underlineColorAndroid='transparent'placeholder='DAY' style={styles.datePickerDay} keyboardType='numeric' maxLength={2} />
            <TouchableOpacity onPress={() => this.fetchFromApi()} style={styles.button}>
              <Text style={styles.dateButtonText}>GET</Text>
            </TouchableOpacity>
          </View>


          <TouchableWithoutFeedback onLongPress={() => console.log('clicked')}>
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