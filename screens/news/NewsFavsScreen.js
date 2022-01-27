import React, { Component } from 'react';
import { View, ScrollView, StyleSheet} from 'react-native';
import { inject, observer } from 'mobx-react';
import COLORS from '../../constants/Colors';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import LogoHeader from '../../components/LogoHeader';
import ListHeader from '../../components/ListHeader';
import TopListComponent from '../../components/TopListComponent';
import CircleItemComponent from '../../components/CircleItemComponent';
import SquareItemComponent from '../../components/SquareItemComponent';

class NewsFavsScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            back: 'Splash'
        }
    }
    
    title = 'Favoritos';

   // let themeColor = props.store.mainStore.getThemeColor();

    themeColor = COLORS.newsColor;


    render(){
        return(
            <ScrollView style={styles.body}>
               <ListHeader titleSection={this.title} />
               <TopListComponent title="Por tipo de comercio"></TopListComponent>
               <ScrollView horizontal = {true}>
                   <View style={{height:150,width:120}}>
                        <CircleItemComponent></CircleItemComponent>
                    </View>
                    <View style={{height:150,width:120}}>
                        <CircleItemComponent></CircleItemComponent>
                    </View>
                    <View style={{height:150,width:120}}>
                        <CircleItemComponent></CircleItemComponent>
                    </View>
                    <View style={{height:150,width:120}}>
                        <CircleItemComponent></CircleItemComponent>
                    </View>
                    <View style={{height:150,width:120}}>
                        <CircleItemComponent></CircleItemComponent>
                    </View>
               </ScrollView>

               <TopListComponent title="Por cercanía"></TopListComponent>
               <ScrollView horizontal = {true}>
                   <View style={{height:200,width:150}}>
                        <SquareItemComponent></SquareItemComponent>
                    </View>
                    <View style={{height:200,width:150}}>
                        <SquareItemComponent></SquareItemComponent>
                    </View>
                    <View style={{height:200,width:150}}>
                        <SquareItemComponent></SquareItemComponent>
                    </View>
                    <View style={{height:200,width:150}}>
                        <SquareItemComponent></SquareItemComponent>
                    </View>
                    <View style={{height:200,width:150}}>
                        <SquareItemComponent></SquareItemComponent>
                    </View>
               </ScrollView>

               <TopListComponent title="Recomendados"></TopListComponent>
               <ScrollView horizontal = {true}>
                   <View style={{height:200,width:150}}>
                        <SquareItemComponent></SquareItemComponent>
                    </View>
                    <View style={{height:200,width:150}}>
                        <SquareItemComponent></SquareItemComponent>
                    </View>
                    <View style={{height:200,width:150}}>
                        <SquareItemComponent></SquareItemComponent>
                    </View>
                    <View style={{height:200,width:150}}>
                        <SquareItemComponent></SquareItemComponent>
                    </View>
                    <View style={{height:200,width:150}}>
                        <SquareItemComponent></SquareItemComponent>
                    </View>
               </ScrollView>

            </ScrollView>
        );
    };


};

NewsFavsScreen.navigationOptions = (navData) => {
    return{
        headerLeft: (
            <HeaderButtons HeaderButtonComponent={HeaderButton} 
            color={this.themeColor}>
                <Item title="Menu" iconName='ios-menu' onPress={() => {
                    navData.navigation.toggleDrawer();
                   
                }} />
            </HeaderButtons>
        ),
        headerRight: (
            <LogoHeader />
        )
    };
    
};


const styles = StyleSheet.create({
    body: {
        backgroundColor: '#ecedec',
        flex:1,
    },

    scroll:{
       height:500,
    }
});

//export default ListScreen;
export default inject('store')(observer(NewsFavsScreen));