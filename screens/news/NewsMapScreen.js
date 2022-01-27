import React , { useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import MapComponent from '../../components/MapComponent';
import ListHeader from '../../components/ListHeader';
import { NEGOCIOS } from '../../data/dummy-data';
import { 
        getUserLocation, 
        getBusinessLocation } from '../../constants/Helpers'
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import COLORS from '../../constants/Colors';
import LogoHeader from '../../components/LogoHeader';

const NewsMapScreen = props => {
    const [isFetching, setIsFetching] = useState(true);
    const [userLocation, setUserLocation] = useState();
    const [allMarkers, setAllMarkers] = useState([]);

    const markers = NEGOCIOS.map(async (elem) => {
        const businessAddress = elem.direccion + ' ' 
                + elem.localidad + ' ' 
                + elem.provincia + ' ' 
                + elem.pais;
        const markLocation = await getBusinessLocation(businessAddress);
        let newMark = {
            lat: markLocation.lat,
            lng: markLocation.lng,
            name: elem.nombre
        }

        return newMark;
    });

    Promise.all(markers).then((values) => {
        if(allMarkers.length == 0){
            setAllMarkers(values);
            locateUser();
        }
    });


    const locateUser = async () => {
        if(!userLocation){
            setUserLocation(await getUserLocation());
            setIsFetching(false);
        }
    }

    return(
        <View style={styles.body}>
            <ListHeader titleSection='Localización' />

            <View style={styles.mapPreview}>
                { isFetching ? <ActivityIndicator size="large" color="green" /> :  
                  <MapComponent region={userLocation} 
                                markers={allMarkers}
                               
                  >
                      
                  </MapComponent>                    
                }

                
            </View>
        </View>
    );
};

NewsMapScreen.navigationOptions = (navData) => {
    return{
        headerLeft: (
            <HeaderButtons HeaderButtonComponent={HeaderButton} 
            color={COLORS.embassyColor}
            
            >
                <Item title="Menu" iconName='ios-menu' onPress={() => {
                    navData.navigation.toggleDrawer();
                   
                }} />
            </HeaderButtons>
        ),
        headerRight: (
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
    body: {
        backgroundColor: '#ecedec',
        height: '100%'
    },
    mapPreview: {
        marginBottom: 10,
        width: '100%',
        height: 400,
        borderColor: '#ccc',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default NewsMapScreen;
