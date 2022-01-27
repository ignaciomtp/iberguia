import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import URL from '../constants/Url';
import NewsItem from './NewsItem';

const NewsList = props => {
    
    const renderNewsItem = itemData => {

        return (
            <NewsItem 
                title={itemData.item.title}
                onSelectbus={() => {
                    props.navigation.navigate({routeName: 'PostPage', params: {
                        item: itemData.item,
                        
                    }});
                }}
                
                //image='https://nexoiberico.ticrevolution.com/uploads/bar20200121.jpg'
                image={URL.BASE + 'uploads/' + itemData.item.image}
                title={itemData.item.title}
                date={itemData.item.creationdate}
            />
        );
    };

    return (
        <View style={styles.list}>
            <FlatList data={props.listData} 
                    keyExtractor={(item, index) => item.id } 
                    renderItem={renderNewsItem}
                    style={{width: '100%'}}
                    refreshing={props.reloading}
                    onEndReached={() =>{props.getmore()}}
                    onEndTreshold={0}
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

export default NewsList;