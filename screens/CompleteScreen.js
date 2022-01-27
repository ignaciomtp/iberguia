import React, { Component } from 'react';
import { Text, View,StyleSheet,TouchableOpacity,Image,Dimensions } from 'react-native';
import Carousel from 'react-native-looped-carousel';
import HeaderComponent from '../components/HeaderComponent';


const { width, height } = Dimensions.get('window');


export default class CompleteScreen extends Component{

    
constructor(props) {
    super(props);
    this.state = {
      size: { width : width-30, height },
    };
  }
  

  _onLayoutDidChange = (e) => {
    const layout = e.nativeEvent.layout;
    this.setState({ size: { width: layout.width, height: layout.height } });
  }

  getData = () =>{
    let data = [
      {
          top:'DISFRUTE DE LOS MEJORES',
          middle:'COMERCIOS',
          bottom: 'DE ESPAÑA Y PORTUGAL',
          desc: 'Lorem ipsum Lorem ipsum dolor sit amet, consectetuer adipiscing elit.'
     
      },
      {
        top:'DISFRUTE DE LOS MEJORES',
        middle:'COMERCIOS',
        bottom: 'DE ESPAÑA Y PORTUGAL',
        desc: 'Lorem ipsum Lorem ipsum dolor sit amet, consectetuer adipiscing elit.'
   
    },
    {
        top:'DISFRUTE DE LOS MEJORES',
        middle:'COMERCIOS',
        bottom: 'DE ESPAÑA Y PORTUGAL',
        desc: 'Lorem ipsum Lorem ipsum dolor sit amet, consectetuer adipiscing elit.'
   
    },
    ];
    return data;
  }

  render(){
    
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <HeaderComponent></HeaderComponent>
        </View>
        <View style={styles.bottom}> 
        <Carousel       
          style={[this.state.size]}
          autoplay ={false}
          pageInfo
          onAnimateNextPage={(p) =>console.log(p)}
        >
            {this.getData().map((item,idx)=>{
              return(
                <View key={idx} style={[this.state.size]}>
                  <Text style={[styles.car_top]}>{item.top}</Text>
                  <Text style={styles.car_center}>{item.middle}</Text>
                  <Text style={styles.car_top}>{item.bottom}</Text>
                  <Text style={styles.car_bottom}>{item.desc}</Text>
                </View>)
            })}

        </Carousel>
          </View>
        </View>
    </View>
  );}
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },

    content:{
      flex:1,
      padding:15,
    },

    header:{
        flex:3,
    
    },
    bottom:{
        flex:2,
    },

    //carousel
    car_top:{
      fontSize:20,
      textAlign:'center',
    },

    car_center:{
      fontSize:30,
      fontWeight:"bold",
      textAlign:'center',
    },

    car_bottom:{
      width:'100%',
      padding:15,
    },
    
});
