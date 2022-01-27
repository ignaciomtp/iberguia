import {observable, action} from 'mobx';
import COLORS from '../constants/Colors';

export default class MainStore {
    @observable section = '';

    @observable activeColor = '';

    @observable isLogged = false;

    @observable user = '';
    
    @observable token = '';

    @observable deviceLang = '';

    @action setActiveColor(val){
        this.activeColor = val;
    }

    @action setDeviceLang(val){
        this.deviceLang = val;
    }

    @action setIsLogged(val){
        this.isLogged = val;
    }

    @action setToken(token){
        this.token = token;
    }

    @action getToken(){
        return this.token;
    }

    @action setSection(sec){
        this.section = sec;
    }

    @action setUser(user){
        this.user = user;
    }

    @action getThemeColor(){
        let themeColor = '';
        switch(this.section){
            case 'Noticias':
            themeColor = COLORS.newsColor;
            break;
            case 'Directorio':
            themeColor = COLORS.directoryColor;
            break;
            case 'Embajadas':
            themeColor = COLORS.embassyColor;

        }

        return themeColor;
    }
}