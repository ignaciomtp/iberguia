
import React, {useState, useEffect} from 'react';
import { View, 
        Text, 
        StyleSheet,
        Dimensions,
        TouchableOpacity
        } from 'react-native';
import COLORS from '../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {getI18n} from '../i18n';

const PaginationButtons = props => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPagesArray, setTotalPagesArray] = useState([]);

    useEffect(() => {
        let b = [];

        for(let i = 1; i <= props.buttons; i++){
            b.push(i);
        }

        setTotalPagesArray(b);
    }, []);

    const gotoPage = (pg) => {
        console.log('hey', pg);
        setCurrentPage(pg);
        props.action(pg - 1);
    }
    

    const renderButtons = () => {
        if(currentPage == 1 || currentPage == 2 || currentPage == props.buttons || currentPage == props.buttons -1){
            
            return(
                <>
                <TouchableOpacity onPress={() => {
                    gotoPage(1)
                }}
                
                >
                    <View style={{...styles.button, 
                        backgroundColor: 1 == currentPage ? '#707070' : '#FFF'}}>
                        <Text style={{
                            fontWeight: 'bold',
                            color: '#000'
                        }}> {1} </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    gotoPage(2)
                }}
                
                >
                    <View style={{...styles.button, 
                        backgroundColor: 2 == currentPage ? '#707070' : '#FFF'}}>
                        <Text style={{
                            fontWeight: 'bold',
                            color: '#000'
                        }}> {2} </Text>
                    </View>
                </TouchableOpacity>

                <View style={{
                        width: 50, 
                        alignItems: 'center',
                        margin: 3
                    }}>
                    <Text style={{fontSize: 30, fontWeight: 'bold'}}>...</Text>
                </View>

                <TouchableOpacity onPress={() => {
                    gotoPage(totalPagesArray[totalPagesArray.length - 2])
                }}
                
                >
                    <View style={{...styles.button, 
                        backgroundColor: totalPagesArray[totalPagesArray.length - 2] == currentPage ? '#707070' : '#FFF'}}>
                        <Text style={{
                            fontWeight: 'bold',
                            color: '#000'
                        }}> {totalPagesArray[totalPagesArray.length - 2]} </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    gotoPage(totalPagesArray[totalPagesArray.length - 1])
                }}
                
                >
                    <View style={{...styles.button, 
                        backgroundColor: totalPagesArray[totalPagesArray.length - 1] == currentPage ? '#707070' : '#FFF'}}>
                        <Text style={{
                            fontWeight: 'bold',
                            color: '#000'
                        }}> {totalPagesArray[totalPagesArray.length - 1]} </Text>
                    </View>
                </TouchableOpacity>
                </>
            );
        
        } else {
            return(
                    <>
                    <TouchableOpacity onPress={() => {
                        gotoPage(1)
                    }}
                   
                    >
                        <View style={{...styles.button, 
                            backgroundColor: 1 == currentPage ? '#707070' : '#FFF'}}>
                            <Text style={{
                                fontWeight: 'bold',
                                color: '#000'
                            }}> {1} </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{
                        width: 50, 
                        alignItems: 'center',
                        margin: 3
                    }}>
                        <Text style={{fontSize: 30, fontWeight: 'bold'}}>...</Text>
                    </View>

                        <View style={{...styles.button, 
                            backgroundColor: '#707070' }}>
                            <Text style={{
                                fontWeight: 'bold',
                                color: '#000'
                            }}> {currentPage} </Text>
                        </View>
                    
                    <View style={{
                        width: 50, 
                        alignItems: 'center',
                        margin: 3
                    }}>
                        <Text style={{fontSize: 30, fontWeight: 'bold'}}>...</Text>
                    </View>

                    <TouchableOpacity onPress={() => {
                        gotoPage(totalPagesArray[totalPagesArray.length - 1])
                    }}
                    
                    >
                        <View style={{...styles.button, 
                            backgroundColor: totalPagesArray[totalPagesArray.length - 1] == currentPage ? '#707070' : '#FFF'}}>
                            <Text style={{
                                fontWeight: 'bold',
                                color: '#000'
                            }}> {totalPagesArray[totalPagesArray.length - 1]} </Text>
                        </View>
                    </TouchableOpacity>
                    </>
                );
        }
    }

    return(
        <>
        { props.refreshing ? null :
        <>
        <View style={{alignItems: 'center', marginTop: 10}}>
            <Text>{getI18n().t('pagina_de', {current: currentPage, total: props.buttons})}</Text>
        </View>
        <View style={styles.bar}>
            {
                currentPage == 1 ? <View style={{...styles.button, backgroundColor: COLORS.directoryColor}}>
                                        <MaterialCommunityIcons name="arrow-left" size={30} color="#FFF" />
                                    </View>
                :
                <TouchableOpacity onPress={() => {
                    gotoPage(currentPage - 1)
                }}>
                    <View style={{...styles.button, backgroundColor: COLORS.directoryColor}}>
                        <MaterialCommunityIcons name="arrow-left" size={30} color="#FFF" />
                    </View>
                </TouchableOpacity>
            }

            {
                props.buttons < 4 ?
                    totalPagesArray.map(elem => {
                        return(
                        <TouchableOpacity onPress={() => {
                            gotoPage(elem)
                        }}
                        key={elem}
                        >
                            <View style={{...styles.button, 
                                backgroundColor: elem == currentPage ? '#707070' : '#FFF'}}>
                                <Text style={{
                                    fontWeight: 'bold',
                                    color: '#000'
                                }}> {elem} </Text>
                            </View>
                        </TouchableOpacity>
                        );
                    })
                : renderButtons()
            }

            {
                currentPage == props.buttons ? <View style={{...styles.button, backgroundColor: COLORS.directoryColor}}>
                                                <MaterialCommunityIcons name="arrow-right" size={30} color="#FFF" />
                                            </View> 
                
                :
            
                <TouchableOpacity onPress={() => {
                    gotoPage(currentPage + 1)
                }}>
                    <View style={{...styles.button, backgroundColor: COLORS.directoryColor}}>
                        <MaterialCommunityIcons name="arrow-right" size={30} color="#FFF" />
                    </View>
                </TouchableOpacity>
            }
        </View>
        </>
        }
        </>
    );
};

const styles = StyleSheet.create({
    bar: {
        flexDirection: 'row',
        marginVertical: 7,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: Dimensions.get('window').width < 411 ? 45 : 50,
        height: 40,
        borderRadius: 15,
        margin: 3,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default PaginationButtons;