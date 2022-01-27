import React, {useRef} from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import URL from '../constants/Url';
import COLORS from '../constants/Colors';
import BusItem from './BusinessItem';

const BusList = props => {
    const businessScroll = useRef(null);

    const goToTop = () => {

        if(businessScroll.current){
            businessScroll.current.scrollToOffset({x: 0, y: 0, animated: true});
        }

    }


    const renderbusItem = itemData => {

        return (
            <BusItem 
                title={itemData.item.name}
                onSelectbus={() => {
                    props.navigation.navigate({routeName: 'BusPage', params: {
                        busId: itemData.item.id,
                        busTitle: itemData.item.name,
                        
                    }});
                }}
                
                //image='https://nexoiberico.ticrevolution.com/uploads/bar20200121.jpg'
                image={URL.BASE + 'uploads/' + itemData.item.image}
                name={itemData.item.name}
                city={itemData.item.locality}
                score={itemData.item.ranking}
                
                country={itemData.item.country}
                region={itemData.item.comunidad}
                province={itemData.item.state}
            />
        );
    };

    return (
        <>
        {
            props.refreshing ? <ActivityIndicator size="large" color={COLORS.directoryColor} /> 
            :
            <FlatList ref={businessScroll}
                    data={props.listData} 
                    keyExtractor={(item, index) => item.id } 
                    renderItem={renderbusItem}                    
                    style={{width: '100%'}}
                    
                    onEndReached={() =>{props.getmore()}}
                    onEndTreshold={0}
            />
        }
            
        </>
    );
};

const styles = StyleSheet.create({
    list: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecedec',
      },
});

export default BusList;