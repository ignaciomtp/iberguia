import React, { Component } from 'react';
import { View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Text } from 'react-native';
import Carousel from 'react-native-anchor-carousel';
import Lightbox from 'react-native-lightbox';

const { width, height } = Dimensions.get('window');


export default class ImageCarousel extends Component{

    
constructor(props) {
    super(props);
    this.state = {
      size: { width : width, height: 150 },
      images: props.images
    };
  }
  

  _onLayoutDidChange = (e) => {
    const layout = e.nativeEvent.layout;
    this.setState({ size: { width: layout.width, height: layout.height } });
  }

  renderItem = ({ item, index }) => {
    const { img } = item;
    return (
      <Lightbox >
        <Image
          style={styles.img}
          source={{uri:img}}
        />
      </Lightbox>
    );
  };

  render(){
   
    return (
      <View style={styles.container}>
          <Carousel
          style={styles.carousel}
          data={this.state.images}
          renderItem={this.renderItem}
          itemWidth={200}
          sliderWidth={400}
          itemHeight={100}
          containerWidth={350}
          ref={(c) => {
            this.numberCarousel = c;
          }}
        />
      </View>
    );}
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        marginBottom: 10
    },

    carousel: {
      flex: 1,
    },
    item: {
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius:10,
    },
    text: {
      fontSize: 100,
      fontWeight: 'bold'
    },
    img: {
      resizeMode: 'contain', 
      flex:1,width:'100%', 
      borderRadius:10, 
      height:150
    }
});
