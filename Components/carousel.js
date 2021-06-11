import * as React from 'react';
import {
  Text,
  View,
  SafeAreaView } from 'react-native';
  import { Platform, NativeModules } from 'react-native'
  import Carousel from 'react-native-snap-carousel';

  export default class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          activeIndex:0,
          carouselItemNames: [],
          carouselItems: []
      }
    }

    componentDidMount(){
      this.getDays()
      console.log(this.state.carouselItems)
    }

    titleCase = (str) => {
      str = str.toLowerCase().split(' ');
      for (let i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
      }
      return str.join(' ');
    }


    //create artwork + link it to ID's

    _renderItem({item,index}){
      let temperatureConverter = (degrees) => {
        return degrees*1.8+32
      }

      if(index === 0){
        return (
          <View style={{
              backgroundColor:'floralwhite',
              borderRadius: 7.5,
              height: 250,
              padding: 50,
              marginTop: 10,
              marginLeft: 20,
              marginRight: 25, }}>
            <Text style={{fontSize: 30}}>Today's Weather</Text>
            <Text>{item.description}</Text>
            <Text>{Math.round(temperatureConverter(item.temp))}°</Text>
          </View>
        )
      }
      else if(index === 1){
        return (
          <View style={{
              backgroundColor:'floralwhite',
              borderRadius: 7.5,
              height: 250,
              padding: 50,
              marginTop: 10,
              marginLeft: 20,
              marginRight: 25, }}>
            <Text style={{fontSize: 30}}>Tomorrow's Weather</Text>
            <Text>{item.description}</Text>
            <Text>{Math.round(temperatureConverter(item.temp))}°</Text>
          </View>
        )
      }
      else {
        // console.log('',item)
        // console.log(index)
        return (
          <View style={{
              backgroundColor:'floralwhite',
              borderRadius: 7.5,
              height: 250,
              padding: 50,
              marginTop: 10,
              marginLeft: 20,
              marginRight: 25, }}>
            <Text style={{fontSize: 30}}>{item.day}'s Weather</Text>
            <Text>{item.description}</Text>
            <Text>{Math.round(temperatureConverter(item.temp))}°</Text>
          </View>
        )
      }
    }

    days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    getDays(){
      // getting today's date
      const today = new Date();
// initializing tomorrow with today's date
      const tomorrow = new Date(today);
// increasing a day in tomorrow and setting it to tomorrow
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfterTomorrow = new Date(today);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      const dayAfterThat = new Date(today);
      dayAfterThat.setDate(dayAfterThat.getDate() + 3);
      const lastDay = new Date(today);
      lastDay.setDate(lastDay.getDate() + 4);

      let names = []
      names.push(this.days[today.getDay()])
      names.push(this.days[tomorrow.getDay()])
      names.push(this.days[dayAfterTomorrow.getDay()])
      names.push(this.days[dayAfterThat.getDay()])
      names.push(this.days[lastDay.getDay()])

      let carouselData = []

      for(let i = 0; i < this.props.fiveday.length; i++){
        // console.log('CURRENT DAY!!!!!!!!',this.props.fiveday[i].temp)
        carouselData.push({day:names[i], description: this.titleCase(this.props.fiveday[i].weather[0].description), temp: this.props.fiveday[i].temp.max, id:this.props.fiveday[i].weather[0].id})
      }
      this.state.carouselItems = carouselData
      // this.setState({carouselItems:carouselData})
    }




    render() {
      // let today = new Date
      // console.log('current',this.props.current)
        return (
          <SafeAreaView style={{flex: 1, paddingTop: 50, }}>
            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center', }}>
                <Carousel
                  layout={"default"}
                  ref={ref => this.carousel = ref}
                  data={this.state.carouselItems}
                  sliderWidth={300}
                  itemWidth={300}
                  renderItem={this._renderItem}
                  onSnapToItem = { index => this.setState({activeIndex:index}) } />
            </View>
          </SafeAreaView>
        );
    }
}
