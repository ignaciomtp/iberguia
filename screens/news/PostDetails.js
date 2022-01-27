import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Text} from 'react-native';
import ImageHeaderNews from '../../components/ImageHeaderNews';
import CommentItem from '../../components/CommentItem';
import YourOpinion from '../../components/YourOpinion';
import ButtonStart from '../../components/ButtonStart';
import LogoHeader from '../../components/LogoHeader';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../../constants/Colors';
import URL from '../../constants/Url';
import {getI18n} from '../../i18n';

const PostDetails = props =>{
    
  const item = props.navigation.getParam('item');
  
  return (
    <ScrollView style={{backgroundColor: '#f2f2f3'}}>
        <ImageHeaderNews title={item.title} 
                        img={URL.BASE + 'uploads/' + item.image}
                        product={item.idproduct}
                        date={item.creationdate}
        >
        </ImageHeaderNews>

        <View style={styles.separator}>
            <View style={{padding: 15}}>
                <Text style={{fontSize: 18, color: '#000'}}>{item.texto}</Text>
            </View>

            <View style={{flex:1}}>
              <ButtonStart 
                    title={getI18n().t('ir_a_negocio')}
                    color={COLORS.newsColor}
                    textColor="#fff"
                    action={() =>{
                      props.navigation.navigate({routeName: 'BusPage', params: {
                          busId: item.idproduct,
                          from: 'news'
                      }});  
                    }}
                />             
            </View>
        </View>

    </ScrollView>
  );

}


PostDetails.navigationOptions = (navData) => {
  const from = navData.navigation.getParam('from');
  return{
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            if(from){
                navData.navigation.navigate({routeName: 'BusPage', params: {
                    busId: from                    
                }});  
            } else {
                navData.navigation.pop();
            }
            
          }}>
          <MaterialCommunityIcons name="arrow-left" size={30} color={COLORS.newsColor} />
        </TouchableOpacity>
        
      ),
      headerRight: () => (
             <TouchableOpacity onPress={() =>{
                  navData.navigation.navigate('Splash');  
                }
            }>
            <LogoHeader />
          </TouchableOpacity>
      )
  };
  
};


const styles = StyleSheet.create({
  content:{
    padding:15,
  },

  separator:{
    borderTopWidth:1,
    borderTopColor:'green',
  },

  item:{
    height:70,
    width:70,
    padding:10,
    
  },

  itemcontent:{
    backgroundColor:'green',
    width:50,
    height:50
  }
});

export default PostDetails;