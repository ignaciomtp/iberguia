import React, {Component} from 'react';
import { HeaderButton } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';
import { inject, observer } from 'mobx-react';

class CustomHeaderButton extends Component {
    constructor(props){
        super(props)
        this.state = {
            themeColor: this.props.store.mainStore.getThemeColor()
        }
    ;}

    

    render(){
        return(
            <HeaderButton {...this.props} 
                IconComponent={Ionicons} 
                iconSize={23} 
                color={this.state.themeColor}
            />
        );
    };
};

export default inject('store')(observer(CustomHeaderButton));