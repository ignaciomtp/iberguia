import React, { Component, useState } from 'react';
import { View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
     } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants/Colors';
import {getI18n} from '../i18n';

const Schedule = (props) =>{
    const [daysLines, setDaysLines] = useState([]);  
    const [visible, setVisible] = useState(false);

    let semana = props.timetable;

    let dias = [];

    const switchVisible = () => {
        setVisible(!visible);
    }

    const weekDay = (d) => {
        let day;

        switch(d){
            case '1':
                day = getI18n().t('Lunes');
                break;
            case '2': 
                day = getI18n().t('Martes');
                break;
            case '3':
                day = getI18n().t('Miercoles');
                break;
            case '4':
                day = getI18n().t('Jueves');
                break;
            case '5':
                day = getI18n().t('Viernes');
                break;
            case '6':
                day =  getI18n().t('Sabados');
                break;
            case '7':
                day =  getI18n().t('Domingos');
                break;
        }

        return day;
    }

    const fillDays = () => {
        
        let title = '';
        let dia = {};
        let h = '';

        for(let j = 0; j < semana.length; j++){
            if(title == ''){
                title = weekDay(semana[j].DAYWEEK);
                h = semana[j].HOURS;
                if(h == 'Cerrado') h = getI18n().t('Cerrado');
            } else {
                if(semana[j].HOURS != h){

                    if(title != weekDay(semana[j - 1].DAYWEEK)){
                        title += ' - ' + weekDay(semana[j - 1].DAYWEEK);
                    }
                    
                    dia.title = title;
                    dia.hours = h;

                    dias.push(dia);

                    dia = {};

                    title = weekDay(semana[j].DAYWEEK);
                    h = semana[j].HOURS;     
                    if(h == 'Cerrado') h = getI18n().t('Cerrado');               
                }                
            }
        }

        if(title != '' && title != weekDay(semana[semana.length - 1].DAYWEEK)){
            title += ' - ' + weekDay(semana[semana.length - 1].DAYWEEK);
        } 

        //title += weekDay(semana[semana.length - 1].DAYWEEK);
        dia.title = title;
        dia.hours = h;

        dias.push(dia);

        if(!daysLines.length){
            setDaysLines(dias);
        }
        
    }


    const drawDay = (days) => {
        let a = 0;
        return days.map((line) => {
            a++;
            return draw2(line, a);
        });
        
    }

    const draw2 = (day, key) => {
        return(
            <View key={key} style={styles.fila}>
                <Text style={styles.dia}>{day.title}</Text>
                <Text>{day.hours}</Text>
            </View>
        );
    }

    fillDays();


    return(
        <View style={styles.content}>
            <View style={styles.secButton}>
                <Text style={{...styles.titleSection, color: COLORS.directoryColor}}>
                    {getI18n().t('Horario') }
                </Text>
                <TouchableOpacity onPress={() =>{
                    switchVisible()
                }}>
                    <MaterialCommunityIcons
                        name={visible ? 'menu-up' : 'menu-down'}
                        size={40} 
                        color={COLORS.directoryColor}
                    />
                </TouchableOpacity>
            </View>
            
            {
                visible ? <View style={styles.separator} >                  

                    {
                    drawDay(daysLines)
                    
                    }
                </View> : null
            }

            
        </View>
    );


}

const styles = StyleSheet.create({
    titleSection: {
        fontSize:20,
        fontWeight: 'bold'
    },
    secButton:{
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderColor: '#CCCCCC',
        borderWidth: 1,
        paddingHorizontal: 5,
        borderRadius: 10
    },
    fila: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: '#CCCCCC',
        borderBottomWidth: 1,
        marginVertical: 5
    },
    dia:{
        fontWeight: 'bold',
        color: COLORS.directoryColor,
        
    },

    content:{
      padding: 15,
      marginVertical: 0,
    },
    separator:{
      flex: 1,
      justifyContent: 'center',
      borderBottomWidth: 2,
      borderBottomColor: COLORS.directoryColor,
      padding: 5
    }

});

export default Schedule;