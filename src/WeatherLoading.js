import { StyleSheet, Text, View, ImageBackground } from 'react-native'
import React from 'react'
import Blink from './Blink'

const WeatherLoading = () => {
  return (
    <View style={styles.heading}>
      <ImageBackground source={require(`../assets/mts_neutral.png`)} imageStyle={{marginTop: 20, height: 350, marginTop: -130}}>
        <ImageBackground imageStyle={{opacity:.75}} source={require(`../assets/birds.gif`)}>
            <View style={[{flexDirection: 'row', justifyContent:'space-between', paddingHorizontal:'5%'}]}>

                <View style={{paddingTop:10, paddingTop:30, justifyContent:'space-between', }}>

                  <View>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={{fontSize: 25, fontWeight: '900', color: '#fff'}}>Weather</Text>
                    </View>

                    <View style={styles.shadow}>
                        <View style={styles.subtitle}>
                          <Text style={{fontSize: 18, fontWeight: 'bold', color: '#545B98'}}>Loading</Text>
                          {/* animate ellipses */}
                          <Blink delay={0} duration={500} style={{alignSelf:'flex-end'}}>
                          <View style={[styles.ellipse, {marginLeft: 2.5}]} />
                          </Blink>
                          <Blink delay={250} duration={500} style={{alignSelf:'flex-end'}}>
                          <View style={styles.ellipse} />
                          </Blink>
                          <Blink delay={500} duration={500} style={{alignSelf:'flex-end'}}>
                          <View style={styles.ellipse} />
                          </Blink>
                        </View>
                    </View>
                  </View>

                </View>
            </View>
        </ImageBackground>
      </ImageBackground>
      </View>

  )
}

export default WeatherLoading

const styles = StyleSheet.create({
  heading: {
    height: '85%',
    width: '300%',
    marginHorizontal: '5%',
    marginTop: '2.5%',
    borderRadius:25,
    overflow:'hidden',
    backgroundColor: 'rgba(3, 71, 50, .5)'
  },
  subtitle: {
    borderRadius: 25,
    flexDirection:'row',
    overflow:'hidden',
    width: 225 ,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop:5,
    backgroundColor:'white'
  },
  ellipse: {
    borderRadius: 50,
    height: 5,
    width:5,
    backgroundColor:'#545B98',
    marginRight:2.5,
    marginBottom: 5
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  }
})
