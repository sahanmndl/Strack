import React, {  } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from "react-native";
import Colors from "../../constants/Colors";
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {

    const navigation = useNavigation()

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Strack</Text>
            <View style={styles.innerMargin} />
            <TouchableOpacity
                style={styles.buttonSubmit}
                onPress={() => navigation.navigate('RegisterScreen')}
            >
                <Text style={styles.btnText}>SIGN UP</Text>
            </TouchableOpacity>
            <View style={styles.innerMargin} />
            <TouchableOpacity
                style={styles.btn2}
                onPress={() => navigation.navigate('LoginScreen')}
            >
                <Text style={styles.btnText2}>SIGN IN</Text>
            </TouchableOpacity>
            <View style={styles.innerMargin} />
        </View>
    )
}

export default SplashScreen

const WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 14,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    title: {
        fontSize: 40,
        fontWeight: '700'
    },
    innerMargin: {
        height: 20
    },
    buttonSubmit: {
        height: 45,
        width: WIDTH - 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.DARK2,
        elevation: 4,
        borderRadius: 4
    },
    btnText: {
        color: "#FFF",
        fontSize: 15,
        fontWeight: "500"
    },
    btn2: {
        height: 45,
        width: WIDTH - 40,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 0.2,
        borderColor: Colors.DARK2,
        borderRadius: 2
    },
    btnText2: {
        color: Colors.DARK2,
        fontSize: 15,
        fontWeight: "500"
    },
})