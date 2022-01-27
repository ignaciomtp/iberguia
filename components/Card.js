import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card = props => {
  return <View style={{...styles.card, ...props.style}}>{props.children}</View>;
};

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.34,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    
    borderRadius: 10,
    backgroundColor: 'white'
  }
});

export default Card;
