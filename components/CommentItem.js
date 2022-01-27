import React, { Component } from 'react';
import { Text, View,StyleSheet,Image } from 'react-native';
import ButtonStart from './ButtonStart';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon,Badge,Avatar} from 'react-native-elements';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import {getI18n} from '../i18n';

class CommentItem extends Component{

    
  constructor(props) {
    super(props);
    this.state = {};
  }

  roundDecimals(num){
      let n = parseFloat(num);
      let rounded = Math.round( n * 10 ) / 10;

      return rounded.toFixed(1);
  }

  getTimeFromDate(date){
      let dd = date.split(" ");
      let fecha = dd[0];
      let hora = dd[1];
      let t = new Date();

      let mes = (t.getMonth() + 1);
      if(mes < 10){
        mes = '0' + mes;
      }

      let dia = t.getDate();
      if(dia < 10){
        dia = '0' + dia;
      }
      
      let today = t.getFullYear() + '-' + mes + '-' + dia;

      let res;

      if(today != dd[0]){
          let fechaStr = fecha.replace('-', '');
          res = moment(fechaStr, "YYYYMMDD").fromNow();
      } else {
          let hh = hora.split(":");
          let h = parseInt(hh[0]);

          let ha = parseInt(t.getHours());

          let mm = parseInt(hh[1]);

          let ma = parseInt(t.getMinutes());

          let numero = ha - h;
          let unidad = 'hours';

          if(numero <= 0){
            numero = mm - ma;
            if(numero < 0){
              numero = numero * (-1);
            }
            unidad = 'minutes';
          } else if(numero == 1){
            unidad = 'hour';
          }

          res = numero + ' ' + unidad + ' ago';

      }
      
      if(this.props.store.mainStore.deviceLang == 'en-US' || this.props.store.mainStore.deviceLang == 'en-UK'){
        return res;
      }

      let resArr = res.split(" ");

      let num = resArr[0] == ('a' || 'an') ? getI18n().t('un') : resArr[0];

      let unit;

      switch(resArr[1]){
          case 'hour':
            unit = getI18n().t('hora');
            break;
          case 'hours':
            unit = getI18n().t('horas');
            break;
          case 'day':
            unit = getI18n().t('dia');
            break;
          case 'days':
            unit = getI18n().t('dias');
            break;
          case 'minute':
            unit = getI18n().t('minuto');
            break;
          case 'minutes':
            unit = getI18n().t('minutos');
            break;
          case 'week':
            unit = getI18n().t('semana');
            break;
          case 'weeks':
            unit = getI18n().t('semanas');
            break;
          case 'month':
            unit = getI18n().t('mes');
            break;
          case 'months':
            unit = getI18n().t('meses');
            break;
          default:
            unit = getI18n().t('días');
      }

      return getI18n().t('hace') + ' ' + num + ' ' + unit;

  }
  
  render(){

  return (
 
   <View style={styles.content}>
       <View style={{flex:1, flexDirection:'row'}}>
           <View style={styles.avatarContent}>
                <Avatar
                    size="medium"
                    rounded
                    title="MT"
                    onPress={() => console.log("Works!")}
                    activeOpacity={0.7}
                />
            </View>

            <View style={styles.dataContent}>
                <Text style={styles.name}>{this.props.comment.username}</Text>
                <Text style={styles.userTime}>{getI18n().t('Usuario')}  
                {this.props.comment.creationdate ? this.getTimeFromDate(this.props.comment.creationdate) : getI18n().t('ahora_mismo')}
                </Text>
            </View>

            <View style={styles.scoreContent}>
                <View style={{...styles.scoreView, backgroundColor: this.props.color, }}>
                    <Text style={styles.scoreText}>{this.roundDecimals(this.props.comment.ranking)}</Text>
                    <Icon style={styles.scoreIcon} size = {15} color='#fff' name='star' />
                </View>
            </View>
        </View>

        <View style={{paddingTop:10}}>
            <Text style={styles.texto}>{this.props.comment.texto} </Text>
        </View>
    </View>
  );}
}

const styles = StyleSheet.create({

    content:{
      flex:1,
      paddingBottom:25
    },

    avatarContent:{
        flex:1
    },

    dataContent:{
        flex:5,
        padding:7,
    },

    name:{
        fontWeight:"bold", 
        fontSize:20,
        marginLeft:10,
    },

    userTime:{
        fontSize:15,
        marginLeft:10,
    },

    scoreContent:{
        flex:1, 
        padding:10, 
        
    },

    scoreView:{
        flex:1,
        flexDirection:'row', 
        borderRadius:5,  
        alignItems:'center',
    },

    scoreText:{
        flex:1, 
        textAlign:'center', 
        color:'#fff',
    },

    scoreIcon:{
        flex:1,
    },

    center:{
        flex:3,
        backgroundColor:'pink',
        borderBottomLeftRadius:15,
        borderBottomRightRadius:15,
    },
    texto: {
      fontSize: 18,
      color: 'grey'
    },

    text_title:{
        fontSize:30,
        fontWeight:'bold',
    },
});

export default inject('store')(observer(CommentItem));