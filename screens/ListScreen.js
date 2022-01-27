import React, { useState }  from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { inject, observer } from 'mobx-react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import ListHeader from '../components/ListHeader';
import { CATEGORIES } from '../data/dummy-data';
import ListButton from '../components/ListButton';
import COLORS from '../constants/Colors';

const ListScreen = props => {
    const title = props.store.mainStore.section;

   // let themeColor = props.store.mainStore.getThemeColor();

    const [themeColor, setThemeColor] = useState('');

    setThemeColor(props.store.mainStore.getThemeColor());
    
    const renderButton = (itemData) => {
        return(
            <ListButton 
                title={itemData.item.title} 
                onSelect={() => {
                    
                    props.navigation.navigate('PostPage');
                }}
                textColor={themeColor}
            />
        );
    };

    return(
        <View style={styles.body}>
            <ListHeader titleSection={title} />

            <FlatList numColumns={2}
                data={CATEGORIES}
                renderItem={renderButton}
                keyExtractor={(item, index) => item.id}
            />
        </View>
    );
};

ListScreen.navigationOptions = (navData) => {
    return{
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton} 
            color={this.themeColor}
            
            >
                <Item title="Menu" iconName='ios-menu' onPress={() => {
                    navData.navigation.toggleDrawer();
                   
                }} />
            </HeaderButtons>
        )
    };
    
};

const styles = StyleSheet.create({
    body: {
        backgroundColor: '#ecedec',
        height: '100%'
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

//export default ListScreen;
export default inject('store')(observer(ListScreen));