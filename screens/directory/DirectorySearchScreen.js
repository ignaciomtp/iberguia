import React, { useState, useEffect } from 'react';
import { View, 
         ScrollView, 
         StyleSheet, 
         Modal,
         ActivityIndicator, 
         FlatList,
         Platform,
         Dimensions,
         Text,
         TextInput, 
         Picker,
         TouchableOpacity} from 'react-native';
import { inject, observer } from 'mobx-react';
import COLORS from '../../constants/Colors';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import LogoHeader from '../../components/LogoHeader';
import ListHeader from '../../components/ListHeader';
import TopListComponent from '../../components/TopListComponent';
import CircleItemComponent from '../../components/CircleItemComponent';
import SquareItemComponent from '../../components/SquareItemComponent';
import SearchInputComponent from '../../components/SearchInputComponent';
import { Icon } from 'react-native-elements';
import FAicon from 'react-native-vector-icons/FontAwesome';
import URL from '../../constants/Url';
import { verifyPermissions, 
        getUserLocation, 
        getBusinessLocation } from '../../constants/Helpers';
import { getDistance } from 'geolib';
import {getI18n} from '../../i18n';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PickerBox from 'react-native-picker-box';

const DirectorySearchScreen = (props) => {
    const [back, setBack] = useState('Splash');
    const [isFetching, setIsFetching] = useState(false);
    const [results, setResults] = useState([]);
    const [query, setQuery] = useState();
    const [allCategories, setAllCategories] = useState([]);
    const [category, setCategory] = useState(0);
    const [searchCompleted, setSearchCompleted] = useState(false);
    const [userLocation, setUserLocation] = useState();
    const [hasPermissions, setHasPermissions] = useState();
    const [showModal, setShowModal] = useState(false);
    const [categoriesIos, setCategoriesIos] = useState([{label: getI18n().t('todas_las_categorias'), value: 0}]);
    const [iosText, setIosText] = useState();
    const [numResults, setNumResults] = useState(0);

    useEffect(() => {
        if(!iosText){
            let a = getI18n().t('todas_las_categorias');
            setIosText(a);
        }
        
    });

    let themeColor;

    const showAll = () => {
        setShowModal(true);
    }

    const verify = async () => {
        setHasPermissions(await verifyPermissions());
    }

    const locateUser = async () => {
        await verifyPermissions();
        setUserLocation(await getUserLocation());
    }

    const getActivitiesFromApi = async () => {
        try {
            let response = await fetch(URL.BASE + 'api/negocios/category/all', 
                {
                    method: 'GET',
                    headers: {
                        authorizationapp: URL.AUTH_APP,
                        'language-user': props.store.mainStore.deviceLang
                    }
                }
            );
            let responseJson = await response.json();

            let tempArray = categoriesIos;

            responseJson.data.forEach(item =>{
                let a = {
                    label: item.name,
                    value: item.id
                }

                tempArray.push(a);

            });

            setCategoriesIos(tempArray);

            setAllCategories(responseJson.data);

        } catch (error) {
            console.error(error);
        }
    }

    const drawPicker = () => {
        if(Platform.OS === 'ios'){
            return(
                <View style={styles.container}>
                    <View style={{width: '85%', justifyContent: 'center'}}>
                        <Text style={styles.welcome} onPress={() => this.myref.openPicker() }>
                            {iosText}
                        </Text>
                        
                        <PickerBox
                            
                            ref={ref => this.myref = ref}
                            data={ categoriesIos }
                            onValueChange={value => {
                                let aa = categoriesIos.find(item => {
                                    return item.label == value;
                                });

                                setCategory(aa.value);
                                setIosText(aa.label);
                                
                            }}
                            selectedValue={ category }
                        />
                    </View>

                    <View style={{width: '15%', alignItems: 'center'}}>
                        <TouchableOpacity onPress={() => this.myref.openPicker()}>
                            <FAicon style={styles.searchIcon} name="caret-down" size={20} color="#000"/>
                        </TouchableOpacity>
                        
                    </View>

                    
                </View>
            );
        } else {
            return(
                <Picker
                    selectedValue={category}
                    style={{height: 50, width: '100%'}}
                    mode='dropdown'
                    onValueChange={(itemValue, itemIndex) =>{
                        setCategory(itemValue);
                    }}>
                    <Picker.Item label={getI18n().t('todas_las_categorias')} value="0" key="0" />
                    {
                        allCategories.map((n) =>{
                            return (
                                <Picker.Item label={n.name} value={n.id} key={n.id} />
                            );
                        })
                    }
                </Picker>
            );
        }
    }

    const search = async() => {
        if(!query){
            alert(getI18n().t('introduce_termino'));
        } else {
            setIsFetching(true);
            setSearchCompleted(false);

            let tempResults = await fetchResults();
            setNumResults(tempResults.total);

            if(tempResults.total <= 21){
                setResults(tempResults.data);
            } else {
                let numPags = Math.floor(tempResults.total / 21);
                
                var b = [];
                
                for(let i = 0; i <= numPags; i++){
                    let a = i * 21;
                    let dt = await fetchResults(a);
                    b = [...b, ...dt.data];
                }
                
                setResults(b);
            }

            setSearchCompleted(true);

            setIsFetching(false);

        }

    }

    const fetchResults = async(offset = 0) => {
        let url = '';
    
        if(category != 0){
            url = URL.BASE + 'api/negocios/' + offset + '?categories=' + category  + '&query=' + query;  
        } else {
            url = URL.BASE + 'api/negocios/' + offset + '?query=' + query;
        }


        try {
            let response = await fetch(url, 
                {
                    method: 'GET',
                    headers: {
                        authorizationapp: URL.AUTH_APP,
                        'language-user': props.store.mainStore.deviceLang
                    },

                }
            );

            let responseJson = await response.json();

            if(responseJson.state == 1){
                return responseJson;
            }
            

        } catch (error) {
            console.error(error);
        }  
    }

    const orderResults = () => {
        setIsFetching(true);

        if(userLocation){
            let resDist = results.map((n)=>{
                let coors = {
                    latitude: n.latitude,
                    longitude: n.longitude
                }

                let distance = getDistance(userLocation, coors, 1);

                let nn = n;
                nn.distance = parseInt(distance / 1000);
                return nn;
            });

            resDist.sort((a, b) => {
                return a.distance - b.distance;
            });

            setResults(resDist);
           
        }

         setIsFetching(false);

    }


    const renderResult = (itemData) => {
        return(
            <TouchableOpacity key={itemData.item.id} onPress={() => {
                setShowModal(false);
                props.navigation.navigate({routeName: 'BusPage', params: {
                            busId: itemData.item.id,
                            busTitle: itemData.item.title,
                            
                }});
            }}>
                <View style={{height:300,width:180}} >
                    <SquareItemComponent
                        title={itemData.item.name}
                        img={URL.BASE + 'uploads/' + itemData.item.image}
                        color={COLORS.directoryColor} 
                        score={itemData.item.ranking}
                        id={itemData.item.id}
                        distance={itemData.item.distance}
                    ></SquareItemComponent>
                </View>
            </TouchableOpacity>
        );        
    }

    title = getI18n().t('Buscar');

    themeColor = COLORS.directoryColor;

    if(hasPermissions == undefined){
        verify();
    } else if(hasPermissions && !userLocation){
        locateUser();
    }

    if(allCategories.length == 0){
        getActivitiesFromApi();
    } 

    return(
        <ScrollView style={styles.body}>
            <ListHeader titleSection={title} />
            <View style= {{padding:15}}>
                <View style={styles.searchSection}>
                    <TextInput
                        style={styles.input}
                        placeholder={getI18n().t('search_your_favorite')}
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => {
                            setQuery(text);
                        }}
                        onSubmitEditing={() =>{
                            search();
                        }}
                    />
                    <Text style={styles.separator}>|</Text>
                    <TouchableOpacity onPress={() =>{
                            search();
                        }}
                    >
                        <FAicon style={styles.searchIcon} name="search" size={20} color="#000"/>
                    </TouchableOpacity>
                    
                </View>
            </View>
            
            <View style= {{padding:15}}>
                <View style={styles.searchSection}>

                {
                    drawPicker()
                }

                    
                </View>
            </View>

            {
                searchCompleted ? <View >
                                    <Text style={styles.numResults}>{numResults} {getI18n().t('Resultados')}</Text>
                                  </View>                                   
                                : null
            }

            <View style={{flexDirection:'row', alignContent:'space-around',
                paddingVertical:15, paddingLeft: 15}}>
                <View style={{width:'75%'}}>
                {
                    hasPermissions ? <TouchableOpacity onPress={() => {orderResults()}} style={{...styles.btn, backgroundColor: COLORS.directoryColor}}>
                                        <Text style={styles.btnText}>{getI18n().t('ordernar_por_cercania')}</Text>
                                    </TouchableOpacity>
                                    : null
                }
                           
                </View>
                <View style={{ width:'25%', flexDirection: 'row-reverse'}}>
                    <TouchableOpacity onPress={() => {showAll()}} 
                        style={{width: 80,
                                alignContent:'flex-end', 
                                right: 0, 
                                }}
                    >
                        <Text>{getI18n().t('ver_todos')} ></Text>
                    </TouchableOpacity>
                    
                </View>
                
            </View>
            
            <View style={{...styles.centered, height: 300}}>
            
                {
                    isFetching ? <ActivityIndicator size="large" color={COLORS.directoryColor} /> :

                    <FlatList 
                            data={results} 
                            keyExtractor={(item, index) => item.id } 
                            renderItem={renderResult}                    
                            style={{width: '100%'}}
                            horizontal={true}
                    />

                }
                
            </View>
            <View>
                <Modal animationType="slide"
                transparent={false}
                visible={showModal}
                
                >
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => {
                            setShowModal(false);
                        }}>
                            <MaterialCommunityIcons name="arrow-left" size={30} color="black" />
                            <Text>{getI18n().t('Volver')}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.centered}>
                        {
                            results.length == 0 ? <Text>{getI18n().t('no_resultados')} </Text> :
                            <FlatList numColumns={2}
                                data={results}
                                renderItem={renderResult}
                                keyExtractor={(item, index) => item.id}
                            />                                
                        }

                    </View>

                </Modal>
            </View>

        </ScrollView>


    );

};

DirectorySearchScreen.navigationOptions = (navData) => {
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
        flex:1,
    },
    separator:{
        fontSize:20
    },

    searchSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius:20,
    },
    searchIcon: {
        padding: 10,
        paddingLeft:15
    },
    input: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        backgroundColor: '#fff',
        color: '#424242',
        borderRadius:20,
    },
    numResults: {
        textAlign: 'center',
        fontSize: 17,

    },
    header: {
        height: 60,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    iospicker: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
    }, 
    container: {
        height: 40,
        
        flexDirection: 'row'
    }, 
    welcome: {
        marginLeft: 25
    },
    btn: {
        paddingHorizontal: 7,
        paddingVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        width: Dimensions.get('window').width <= 380 ? '70%' : '50%'
    },
    btnText: {
        fontWeight: 'bold', 
        color: '#FFF',

    }
});

export default inject('store')(observer(DirectorySearchScreen));