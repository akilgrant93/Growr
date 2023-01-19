import { StyleSheet, View  } from 'react-native'
import React from 'react'
import { BookOpenIcon, ArrowDownLeftIcon } from 'react-native-heroicons/solid'
import Animated, { withSpring, useSharedValue, useAnimatedGestureHandler, useAnimatedStyle } from 'react-native-reanimated';
import { TapGestureHandler } from 'react-native-gesture-handler'
import  Svg, { Path, G } from 'react-native-svg'
import { Entypo, FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';

const CategoryDescription = (props) => {
  const pressed = useSharedValue(false);

  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      pressed.value = true;
    },
    onEnd: (event, ctx) => {
      pressed.value = false;
    },
  });

  const uas = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(pressed.value ? -60 : -160,{damping:75, mass:.5}),

        },{
          translateY: withSpring(pressed.value ? 485 : 700,{damping:75, mass:.5})
        }
      ]
    };
  });

  const opacity = useAnimatedStyle(() => {
    return {
      opacity: pressed.value ? 1 : 0

    };
  });

  const opacityInverse = useAnimatedStyle(() => {
    return {
      opacity: pressed.value ? 0 : 1

    };
  });

  const categoryText = () => {
    if(props.name === 'hydroponic'){
      return 'Hydroponics is a type of soilless gardening that can be done either indoors or outdoors. It’s a great option for people with little or no gardening space, or who want to grow herbs and vegetables through the winter.'
    }
    if(props.name === 'houseplant'){
      return 'A houseplant, sometimes known as a pot plant, potted plant, or an indoor plant, is an ornamental plant that is grown indoors. As such, they are found in places like residences and offices, mainly for decorative purposes. Common houseplants are usually tropical or semi-tropical, and are often epiphytes, succulents or cacti.'
    }
    if(props.name === 'fruit'){
      return 'In common language usage, fruit normally means the seed-associated fleshy structures (or produce) of plants that typically are sweet or sour and edible in the raw state, such as apples, bananas, grapes, lemons, oranges, and strawberries.'
    }
    if(props.name === 'vegetable'){
      return `A vegetable may be defined as \"any plant, part of which is used for food,\" a secondary meaning then being \"the edible part of such a plant.\" A more precise definition is \" any plant part consumed for food that is not a fruit or seed, but including mature fruits that are eaten as part of a main meal.\"`
    }
    if(props.name === 'culinary'){
      return 'Herbs are a widely distributed group of plants, excluding vegetables and other plants consumed for macronutrients, with savory or aromatic properties that are used for flavoring and garnishing, medicinal use, or fragrance. Herbs generally refers to the leafy green or flowering parts of a plant (either fresh or dried).'
    }
    if(props.name === 'carnivorous'){
      return 'Carnivorous plants are plants that derive some or most of their nutrients from trapping and consuming animals or protozoans, typically insects. Though carnivorous plants generate some of their energy from photosynthesis, carnivorous plants have adapted to grow in places where the soil is thin or poor in nutrients, especially nitrogen, such as acidic bogs.'
    }
  }

  return (
    <TapGestureHandler onGestureEvent={eventHandler}>
          <Animated.View style={[{position: 'absolute', padding: 25,backgroundColor:'#F97068', borderTopRightRadius: 100, width: '70%', height: '50%'}, uas]}>
            <View style={{width: '80%', alignSelf:'flex-end'}}>

            <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
              <View style={[{alignItems:'center'}]}>
              <Animated.View style={opacityInverse}>
              <BookOpenIcon style={{position:'absolute', left: 25, top:15}} color={'white'} size={50}/>
              </Animated.View>

              <Animated.View style={opacity}>
              <ArrowDownLeftIcon style={{position:'absolute', left:55, top: 10}} color={'white'} size={12.5}/>
              </Animated.View>

              <Animated.View style={opacity}>
              {props.name ==='hydroponic' ?
              <View>
              <Svg style={{marginRight: '3.5%'}} width={50}height={50} fill={'#fff'} viewBox="0 0 792 612">
                          <G>
                          <Path d="M244.5,272.9c-2.8-6-1.9-11.5-2-16.9c-0.1-8.3-0.1-16.6,0-24.9c0-2,0.2-4.1,0.8-6.1c1.4-4.7,5.6-8,10.6-8.4   c1.4-0.1,2.7-0.1,4.1-0.1c39.3,0,78.6,0,117.9,0c1.6,0,3.1,0,5.1,0c-0.1-1.3-0.1-2.2-0.3-3c-2.4-9-6.2-17.4-12.3-24.5   c-5.3-6.3-11.9-10.9-19.1-14.7c-9.8-5.2-20.2-8.8-30.7-12.4c-10.8-3.6-21.6-7.2-32.4-10.8c-14.2-4.8-26.4-12.7-36.8-23.5   c-9.4-9.8-16.6-21.1-22.1-33.5c-7.7-17.2-12.5-35.2-14.5-53.9c-0.6-5.4,2-8.8,7.4-9.4c15.2-1.6,30.4-1.8,45.7-0.8   c13.6,0.9,26.9,3,40,6.8c22.3,6.5,42,17.5,57.7,34.9c12.1,13.5,20.1,29.2,25.1,46.5c1.3,4.5,2.3,9.1,3.1,13.6   c0.8,4.5,1.4,9,2.1,13.9c0.8-4.8,1.4-9.3,2.2-13.7c3.3-19.2,10.4-36.8,21.9-52.5c11.7-15.9,26.7-27.5,44.6-35.6   c16.1-7.3,33.2-11.2,50.7-13.2c12.6-1.4,25.2-1.5,37.9-1.2c5.2,0.2,10.4,0.7,15.7,1.2c6.6,0.6,9.2,3.9,8.3,10.6   c-1.3,10-3.3,19.8-6,29.4c-4.3,14.9-10.1,29-18.7,41.9c-9.7,14.6-22,26.5-38,33.9c-8.1,3.8-16.8,6.4-25.3,9.4   c-15.3,5.3-30.8,9.7-45.4,16.9c-7.9,3.8-15,8.6-21,15c-6.8,7.4-10.7,16.3-13.4,25.8c-0.2,0.6-0.1,1.3-0.2,2.4   c1.7,0.2,3.2,0.4,4.7,0.4c13.6,0,27.1,0,40.7,0c26.2,0,52.4,0,78.6,0c1.9,0,3.9,0,5.7,0.6c5.1,1.5,8.3,6,8.5,11.6   c0.1,4.7,0,9.3,0,14c0,5.2,0,10.5,0,15.7c0,4.6,0.6,9.3-1.8,14.2c1.9,0.1,3.3,0.2,4.7,0.2c23.1,0,46.2,0,69.4,0   c3.9,0,7.8,0.1,11.4,1.7c7.9,3.4,12.1,9.4,12.6,17.9c0.2,3.3,0,6.6,0.1,9.9c0.2,12.1-10,20.6-20.5,20.5c-32.3-0.2-64.7-0.1-97-0.1   c-5.3,0-5.7-1-6.3,6c-0.9,11.5-2,22.9-3.1,34.3c-0.8,8.6-1.5,17.2-2.3,25.8c-0.8,9.2-1.7,18.4-2.5,27.5c-0.8,8.5-1.5,17-2.2,25.5   c-1.1,12.1-2.2,24.3-3.3,36.4c-0.8,8.6-1.5,17.2-2.2,25.9c-0.6,6.5-1.2,12.9-1.8,19.4c-1.1,11.9-11,20.1-22.8,20   c-43.6-0.2-87.2-0.1-130.9-0.1c-12.2,0-24.4-0.3-36.6,0.1c-12.8,0.4-22.1-9.9-23-21c-1.4-18.9-3.4-37.9-5.1-56.8   c-1.3-13.9-2.4-27.9-3.6-41.8c-1.3-14.3-2.6-28.6-3.9-42.8c-1.2-13.9-2.4-27.9-3.7-41.8c-0.4-4.5-0.8-9.1-1.3-13.6   c-0.2-2.5-0.6-2.9-3.2-2.9c-7.2-0.1-14.4,0-21.5,0c-26.1,0-52.2,0-78.2,0c-9.1,0-15.3-4.4-19-12.5c-2.5-5.5-2.4-19.7,0.1-25.2   c3.2-6.8,8.5-10.9,16-11.9c2.2-0.3,4.5-0.4,6.8-0.4c22.8,0,45.6,0,68.3,0C240.6,272.9,242.2,272.9,244.5,272.9z M322.4,323.2   c0,1.3,0,2.1,0,2.9c0.8,13.9,1.5,27.7,2.3,41.6c0.5,9.4,1,18.9,1.5,28.3c0.9,15,1.7,30,2.6,45c0.5,8.6,0.9,17.3,1.5,25.9   c0.3,4.7,0.4,9.3,1.2,13.9c1.6,9.6,10.5,16.3,19.9,15.4c9.7-1,17-8.8,16.9-18.6c0-4.5-0.4-9.1-0.6-13.6c-0.9-16-1.8-32-2.7-48.1   c-0.7-11.6-1.4-23.2-2-34.8c-1-18.1-2-36.1-2.9-54.2c-0.2-3.8-0.3-3.9-3.9-3.9c-10,0-20,0-30.1,0   C324.9,322.9,323.8,323.1,322.4,323.2z M447.2,322.9c-4.8,0-9.6,0-14.4,0c-4.2,0-4.4,0-4.7,4.3c-0.4,5.7-0.6,11.4-0.9,17   c-0.5,9.7-1,19.3-1.6,29c-0.8,14.1-1.7,28.2-2.5,42.3c-0.6,9.8-1,19.5-1.6,29.3c-0.3,5.5-0.8,10.9-1.1,16.4   c-0.3,5.3-0.5,10.7-0.8,16c-0.2,3.5,0.8,6.8,2.6,9.8c4.3,7.1,12.5,10.5,20.2,8.7c8.3-2,14-8.7,14.5-17.3c0.5-8.6,1-17.3,1.5-25.9   c0.3-4.9,0.5-9.8,0.8-14.7c0.8-13.6,1.7-27.3,2.4-40.9c0.6-10,1-20,1.6-30c0.8-13.4,1.6-26.8,2.4-40.2c0.2-3.3-0.2-3.7-3.6-3.7   C457.2,322.9,452.2,322.9,447.2,322.9z"/>
                          <Path d="M617.4,472.2c-0.7-10.2,8.3-22.5,22.6-22.3c12.5,0.1,22.1,10.1,22.1,22.9c0,11.8-10.4,22.2-23.1,22   C627,494.6,616.7,483.8,617.4,472.2z"/>
                          <Path d="M220.1,491c-12.4,0-21.9-9.7-22.2-22.1c-0.3-11.3,8.8-22.8,22.6-22.7c12.4,0.1,22.2,10,22.2,22.5   C242.7,482.5,231.1,491.6,220.1,491z"/>
                          <Path d="M578.2,501.6c10.9,0.1,19.2,8.5,19.1,19.4c-0.1,10.4-8.9,19.1-19.3,19c-10.7-0.1-19.2-8.9-19.1-19.6   C559,509.7,567.4,501.5,578.2,501.6z"/>
                          <Path d="M125.4,539.5c0-10.5,8.4-18.7,19-18.7c10.4,0.1,18.9,8.6,18.8,19c-0.1,10.4-8.7,18.8-19.1,18.7   C133.6,558.4,125.4,550,125.4,539.5z"/>
                          </G>
                          <Path d="M252.2,348c-6.3-2.4-11-0.9-14.2,4.9c-0.5,1-1,2-1.5,3c-7.6,13.8-18.5,23.5-34,27.6c-14.2,3.8-27.6,1.6-40-5.9  c-9.2-5.6-15.9-13.5-20.7-23.1c-1.4-2.9-3.3-5.2-6.3-6.4c-5.1-2-13-1.1-16.3,5.8c-3.6,7.6-8.5,14.2-15.2,19.5  c-11.2,8.9-23.9,13-38.2,11.4c-0.5-0.1-0.9-0.1-1.4-0.2v25.1c5,0.4,10.2,0.3,15.5-0.3c18.8-1.9,34.6-9.9,47.7-23.5  c0.8-0.9,1.8-1.7,2.9-2.7c1,0.9,1.6,1.4,2.2,1.9c2.9,2.7,5.6,5.7,8.7,8.1c17,13.3,36.3,18.4,57.6,16.1c17.3-1.9,32.3-9.1,44.8-21.2  c6.5-6.3,11.6-13.7,15.5-21.9C263.4,357.9,258.1,350.4,252.2,348z"/>
                          <Path d="M727.7,384.8c-3.7,0.4-7.5,0.5-11.5,0.2c-14.4-1.2-26.1-7.5-35.3-18.6c-3.2-3.9-5.8-8.4-8.3-12.9c-1.5-2.6-3.5-4.5-6.2-5.5  c-6.6-2.4-12.6,0-16.2,6.2c-2.5,4.3-5,8.8-8.2,12.5c-11.7,13.4-26.4,19.9-44.3,18.2c-17.5-1.7-30.8-10.4-40-25.3  c-1.4-2.3-2.6-4.8-3.9-7.2c-2.1-3.8-5.3-6-9.8-5.6c-9.3,0.9-15.6,10.4-11.4,19.2c6.5,13.6,16,24.6,28.8,32.5  c15.5,9.5,32.4,13.1,50.4,10.9c17.5-2.1,32.8-9.1,45.2-21.8c1.3-1.4,2.5-3,4.1-4.9c2.2,2.1,3.6,3.5,5.1,5  c17.1,16.7,37.7,23.9,61.3,22.1c0.1,0,0.2,0,0.3,0V384.8z"/></Svg>
              </View>
                          : null}
              {props.name ==='houseplant' ?
              <View style={{marginBottom: 10}}>
                <Entypo name='flower' size={50} color={'white'}/>
              </View>
                          : null}

              {props.name ==='fruit' ?
              <View style={{marginBottom:10}}>
              <FontAwesome5 name='lemon' size={50} color={'white'}/>
            </View>
                          : null}

              {props.name ==='vegetable' ?
              <View style={{marginBottom:10}}>
                <FontAwesome5 name='carrot' size={50} color={'white'}/>
              </View>
                          : null}
              {props.name ==='culinary' ?
              <View style={{marginBottom:10}}>
                <FontAwesome name='pagelines' size={50} color={'white'}/>
              </View>
                          : null}
              {props.name ==='carnivorous' ?
              <View style={{marginBottom:10}}>
                <Ionicons name='bug' size={50} color={'white'}/>
              </View>
                          : null}
              </Animated.View>
              <Animated.Text style={[{ color:'white', fontSize: 12, marginLeft: 10}, opacity]}>{categoryText()}</Animated.Text>
              </View>
            </View>
            </View>
          </Animated.View>
          </TapGestureHandler>
  )
}

export default CategoryDescription

const styles = StyleSheet.create({})
