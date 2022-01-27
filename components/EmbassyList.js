import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import URL from '../constants/Url';
import EmbassyItem from './EmbassyItem';

const EmbassyList = props => {
    
    const renderEmbassyItem = itemData => {
        
        return (
            <EmbassyItem 
                
                onSelectbus={() => {
                    props.navigation.navigate({routeName: 'EmbassyMapDetails', params: {
                        item: itemData.item,
                    }});
                }}
                
                name={itemData.item.name}
                address={itemData.item.address}
                locality={itemData.item.locality}
                state={itemData.item.state}
                country={itemData.item.countryisocode}
                phone={itemData.item.phone}
                description={itemData.item.description}
                web={itemData.item.web}
            />
        );
    };

    return (
        <View style={styles.list}>
            <FlatList data={props.listData} 
                    keyExtractor={(item, index) => item.id } 
                    renderItem={renderEmbassyItem}
                    style={{width: '100%'}}
                    refreshing={props.reloading}
                    
            />
        </View>
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

export default EmbassyList;