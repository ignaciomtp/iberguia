import React from 'react';
import { View, ScrollView, StyleSheet, Image, ImageBackground, Text } from 'react-native';
import COLORS from '../constants/Colors';

const ImagesThumbs = props => {

    const images = props.images;

    const renderImage = (url) => {
        return(
            <View style={styles.thumb}>
                <Image source={{uri: url}} 
                    style={styles.bgImage}
                    
                    >
                    
                </Image>
            </View>
        );
    };

     return(
        <View style={styles.thumbContainer}>
            <ScrollView horizontal={true}>
                {
                    images.forEach(element => {
                        console.log(element);
                        renderImage(element);
                    })
                }
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
   thumbContainer: {
        width: '100%',
        padding: 15,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.directoryColor
   },
   thumb: {
       height: 180,
       width: 250,
       borderRadius: 10,
       marginHorizontal: 10,
       overflow: 'hidden',
       backgroundColor: 'black'
   },
   bgImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end'
    },
});

export default ImagesThumbs;