import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ImageBackground } from 'react-native';
import StarRating from 'react-native-star-rating';
import Card from './Card';
import COLORS from '../constants/Colors';

const BusItem = props => {
    return (
        <Card style={styles.item}>
            <TouchableOpacity onPress={props.onSelectbus}>
                <View>
                    <View style={{...styles.busRow, ...styles.busHeader}}>
                        <ImageBackground source={{uri: props.image}} style={styles.bgImage} >
                            
                        </ImageBackground>   
                    </View>
                    <View style={{...styles.busRow, ...styles.busDetail}}>
                        <Text style={styles.title} numberOfLines={1} >{props.name}</Text>
                        
                        <StarRating
                            disabled={false}
                            maxStars={5}
                            rating={parseFloat(props.score)}
                            starSize={20}
                            fullStarColor="yellow"
                        />
                        <Text style={styles.city}>{props.city} </Text>
                        
                    </View>
                    
                </View>
            </TouchableOpacity>
        </Card>
        

    );
};

const styles = StyleSheet.create({
    busRow: {
        flexDirection: 'column'
    },
    busItem: {
        height: 300,
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: 10,
        borderBottomColor: 'red',
        borderBottomWidth: 1,
    },
    item: {
        height: 300,
        margin: 20,
        borderRadius: 10,
        elevation: 7,
        overflow: Platform.OS == 'android' && Platform.Version >= 21 
            ? 'hidden' 
            : 'visible',
    },
    busHeader: {
        borderBottomColor: 'red',
        borderBottomWidth: 2,
         overflow: 'hidden',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    busDetail: {
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        height: '15%'
    },
    bgImage: {
        width: '100%',
        height: 200,
        justifyContent: 'flex-end'
    },
    title: {

        fontSize: 20,
        color: 'black',
        paddingVertical: 5,
        
        textAlign: 'left'
    },
    city: {
        color: COLORS.directoryColor,
        marginTop: 7   
    }
});

export default BusItem;