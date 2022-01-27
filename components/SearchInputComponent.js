import React from 'react';
import { View, TextInput, StyleSheet,Text } from 'react-native';
import { Icon } from 'react-native-elements';
import FAicon from 'react-native-vector-icons/FontAwesome';

const SearchInputComponent = props => {
    return(
        <View style={styles.searchSection}>
            <FAicon style={styles.searchIcon} name="search" size={20} color="#000"/>
            <Text style={styles.separator}>|</Text>
            <TextInput
                style={styles.input}
                placeholder="Busque su comercio favorito"
                underlineColorAndroid="transparent"
                onChangeText={(text) => {
                    props.action(text);
                }}
            />
            <Text style={styles.separator}>|</Text>
            <FAicon style={styles.searchIcon} name="filter" size={20} color="#000"/>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row',
        alignContent:'space-around',
        padding:15
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
});

export default SearchInputComponent;