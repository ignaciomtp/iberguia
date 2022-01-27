import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import SideSwipe from 'react-native-sideswipe';
import HeaderComponent from '../components/HeaderComponent';
import { inject, observer } from 'mobx-react';
import COLORS from './../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {getI18n} from '../i18n';
import { showMessage, hideMessage } from "react-native-flash-message";

const { width, height } = Dimensions.get('window');


class SplashScreen extends Component{

    
  constructor(props) {
    super(props);
    this.state = {
      size: { width, height },
      color: COLORS.newsColor,
      nextScreen: 'News',
      activeIndex: 0
    };
    props.store.mainStore.setSection('Noticias');

    const welcome = this.props.navigation.getParam('welcome');

    if(welcome){
    
      showMessage({
              message: welcome,
              type: "success",
              position: {
                top: 60,
                left: 40,
                right: 0,
                bottom: 0
              },
              icon: 'success',
              duration: 3000

      });
    }
  }
  

  _onLayoutDidChange = (e) => {
    const layout = e.nativeEvent.layout;
    this.setState({ size: { width: layout.width, height: layout.height } });
  }

  getData = () =>{
    let data = [
      {
        carrousel:{
          top: getI18n().t('ULTIMAS'),
          middle:getI18n().t('NOTICIAS'),
          bottom: getI18n().t('Enterate')
        },
        color: COLORS.newsColor,
        path:'News',
        title: 'Noticias'
      },
      {
        carrousel:{
          top: getI18n().t('BUSQUE_EN_SU'),
          middle:getI18n().t('DIRECTORIO'),
          bottom: getI18n().t('aqui_esta')
        },
        color: COLORS.directoryColor,
        path:'Directory',
        title: 'Directorio'
      },
      {
        carrousel:{
          top: getI18n().t('BUSQUE_SU'),
          middle: getI18n().t('EMBAJADA_CONSULADO'),
          bottom: getI18n().t('necesitas_ayuda')
        },
        color: COLORS.embassyColor,
        path:'Embassy',
        title: 'Embajadas'
      }
    ];
    return data;
  }

  changeData = (n) =>{
    let data = this.getData();
    this.setState({
      color: data[n].color,
      nextScreen: data[n].path,
      activeIndex: n
    });
    this.props.store.mainStore.setSection(data[n].title);
  }

  showDot = (n) => {
      let icon;
      let color;

      if(this.state.activeIndex === n){
        icon = 'checkbox-blank-circle';
        color = this.state.color;

        return(
          <View style={{marginHorizontal: 20}}>
              <MaterialCommunityIcons name={icon} size={25} color={color} />
          </View>

        );

      } else {
        icon = 'checkbox-blank-circle-outline';
        color = 'grey';

        return(
          <View style={{marginHorizontal: 20}}>
            <TouchableOpacity onPress={() =>this.changeData(n)}>
              <MaterialCommunityIcons name={icon} size={25} color={color} />
            </TouchableOpacity>
          </View>

        );
      }

      
      


  }

  getThemeColor = () => {

    let themeColor = '';
    switch(this.section){
        case 'Noticias':
            themeColor = Colors.newsColor;
            break;
        case 'Directorio':
            themeColor = Colors.directoryColor;
            break;
        case 'Embajadas':
            themeColor = Colors.embassyColor;
    }

    return themeColor
}

  render(){
    console.log('Current section: ' + this.props.store.mainStore.section);
  return (
    <View style={styles.container}>
      <View style={[styles.vertical_line,{backgroundColor: this.state.color}]}></View>

      <View style={styles.content}>
          <View style={styles.header}>
            <HeaderComponent></HeaderComponent>
          </View>
          <View style={styles.bottom}> 

            <SideSwipe
              
              index={this.state.activeIndex}
              style={{ width }}
              data={this.getData()}
            
              onIndexChange={(p) =>this.changeData(p) }
              renderItem={({ idx, currentIndex, item, animatedValue }) => (


                    <View key={idx} style={[this.state.size,{padding:15}]}>
                      <Text style={styles.car_top}>{item.carrousel.top}</Text>
                      <Text style={styles.car_center}>{item.carrousel.middle}</Text>
                      <Text style={styles.car_bottom}>{item.carrousel.bottom}</Text>
                    </View>
              )}
            />


          </View>
      </View>

      <View style={styles.bulletContainer}>
        {this.showDot(0)}
        {this.showDot(1)}
        {this.showDot(2)}
      </View>

      <TouchableOpacity style={[styles.btn_access,{backgroundColor:this.state.color}]}
              onPress={() => {                  
                this.props.store.mainStore.setActiveColor(this.state.color);
                this.props.navigation.navigate({routeName: this.state.nextScreen});
              }}>
            <MaterialCommunityIcons name="arrow-right-thick" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );}
}

export default inject('store')(observer(SplashScreen));

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

    vertical_line:{
      position:'absolute',
      right:0,
      width:15,
      top:0,
      bottom:0
    },  

    header:{
        flex:3,
    
    },
    bottom:{
        flex:2,
    },

    //carousel
    car_top:{
      fontSize: width <= 320 ? 15 : 20
    },

    car_center:{
      fontSize: width <= 320 ? 23 : 30,
      fontWeight:"bold"
    },

    car_bottom:{
      fontSize: width <= 320 ? 23 : 20,
      width:'70%'
    },

    //button down

    btn_access:{
      backgroundColor:'green', 
      position:'absolute', 
      right:15, 
      bottom:40, 
      width:70, 
      borderTopLeftRadius:50, 
      borderBottomLeftRadius:50,
      height:50,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
     
    },
    bulletContainer: {
      position:'absolute', 
      left: 40, 
      bottom: 50, 
      width: 100,   
      flexDirection: 'row'
    },     
    
});
