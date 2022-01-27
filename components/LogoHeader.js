import React from 'react';
import { Image } from 'react-native';

const LogoHeader = props => {
    return(
        <Image style={{width: 50, height: 50}}
        source={require('../assets/images/logo.png')} />
    );
};

export default LogoHeader;