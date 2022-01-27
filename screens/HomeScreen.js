import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ActivityIndicator, 
  View,
  Text,
} from 'react-native';
import HeaderComponent from './../components/HeaderComponent';
import ButtonStart from '../components/ButtonStart';
import COLORS from '../constants/Colors';
import {getI18n} from '../i18n';
import {AsyncStorage} from 'react-native';
import { inject, observer } from 'mobx-react';

const HomeScreen = props => {
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    retrieveSession();
  }, []);

  const retrieveSession = async() => {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    const token = await AsyncStorage.getItem('token');

    if(user && token){
      props.store.mainStore.setIsLogged(true);
      props.store.mainStore.setToken(token);
      props.store.mainStore.setUser(user);

      props.navigation.navigate({routeName: 'Splash'});
    } else {
      setIsFetching(false);
    }
  }

  return (
    <View style={styles.container}>
    {
      isFetching ? <View style={styles.centered}>
                    <ActivityIndicator size="large" color={COLORS.directoryColor} />
                  </View> 
                  : 
      <>
      <View style={{flex:3}}>
        <HeaderComponent></HeaderComponent>
      </View>
      
      <View style={{flex:2}}>
          <View style={{padding:15}}>
            <Text style={styles.car_top}>{getI18n().t('BIENVENIDO')}</Text>
            <Text style={styles.car_center}>{getI18n().t('DIRECTORIO')}</Text>
            <Text style={styles.car_top}>{getI18n().t('CON')} {getI18n().t('BOLSILLO')}</Text>

          </View>
      </View>
      <View style={styles.tabBarInfoContainer}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <ButtonStart 
                title={getI18n().t('Registrarse')}
                color={COLORS.directoryColor}
                textColor="#fff"
                action={() =>{
                  props.navigation.navigate({routeName: 'Register'})
                }}
            />  
          </View>

          <View style={{flex: 1, alignItems: 'center'}}>
          <ButtonStart 
                title={getI18n().t('Entrar')}
                color={COLORS.newsColor}
                textColor="#fff"
                action={() =>{
                  props.navigation.navigate({routeName: 'Login'})
                }}
            />  
          </View>
      </View>
      </>
      }
    </View>
    
  );
}

HomeScreen.navigationOptions = {
  header: null,
};


export default inject('store')(observer(HomeScreen));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  car_top:{
    fontSize:20
  },

  car_center:{
    fontSize:30,
    fontWeight:"bold"
  },

  car_bottom:{
    width:'70%'
  },

  tabBarInfoContainer: {
    padding:10,
    flex:1,
    flexDirection:'row',
    alignItems:'center',
  },

});
