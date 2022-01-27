import React, { Component } from 'react';
import { Text, View,StyleSheet} from 'react-native';
import { Icon } from 'react-native-elements';

export default class DataDetails extends Component{

    
constructor(props) {
    super(props);
    this.state = {

    };
  }
  

  render(){
    let data = [1,2,3,4,5];

  return (
    
 
   <View style={styles.content}>
        <View style={styles.top}>
            <View style={styles.contentTopTop}> 
                {data.map((n)=>{
                    return(<Icon key={n} style={styles.scoreIcon} size = {15} color='green' name='star' />)
                })}
                
                <Text>4.8 (161)</Text>
            </View>
            <View>
                <Text>País / Región / Provincia / Localidad</Text>
            </View>
        </View>
        <View style={styles.bottom}>
            <View style={styles.iconContainer}>
                <Icon name='explore' />
                <Text style={styles.iconText}>Ir</Text>
            </View>

            <View style={styles.iconContainer}>
                <Icon name='person' />
                <Text style={styles.iconText}>Comentar</Text>
            </View>

            <View style={styles.iconContainer}>
                <Icon name='share' />
                <Text style={styles.iconText}>Compartir</Text>
            </View>

            <View style={styles.iconContainer}>
                <Icon name='search' />
                <Text style={styles.iconText}>Buscar</Text>
            </View>
        </View>
    </View>
  );}
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'space-between',
    },
    top:{
        flex:1
    },
    bottom:{
        flex:1,
        flexDirection:'row',
    },

    contentTopTop:{
        flex:1,
        flexDirection:'row',
    },

    scoreIcon:{
        flex:1,
    },

    iconContainer:{
        paddingTop:40,
        flex:1,
    },

    iconText:{
        textAlign:'center',
    }
});
