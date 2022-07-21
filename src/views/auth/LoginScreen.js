import React, { useState } from "react";
import { ActivityIndicator, Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from "react-native-paper";
import Colors from "../../constants/Colors";
import Parse from "parse/react-native";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = ({navigation}) => {

    //const navigation = useNavigation()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const login = async () => {
        setLoading(true)
        const usernameValue = username.trim()
        const passwordValue = password.trim()

        return await Parse.User.logIn(usernameValue, passwordValue)
            .then(async (loggedInUser) => {
                if(loggedInUser.get('emailVerified') === true) {
                    const currentUser = await Parse.User.currentAsync()
                    console.log(loggedInUser == currentUser)
                    navigation.reset({
                        index: 0,
                        routes: [{name: "MainScreen"}]
                    })
                    return true
                } else {
                    Alert.alert("Error!", `Please verify your email first!`)
                    await Parse.User.logOut()
                    return false
                }
            })
            .catch((error) => {
                Alert.alert("Error!", error.message)
                return false
            })
            .finally(() => {
                setUsername("")
                setPassword("")
                setLoading(false)
            })
    }

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 32, fontWeight: '600'}}>Sign In</Text>
            <View style={styles.innerMargin} />
            <TextInput
                style={styles.textInput}
                mode='outlined'
                label="Username"
                maxLength={16}
                left={<TextInput.Icon name='account' />}
                value={username}
                onChangeText={username => setUsername(username)}
            />
            <View style={styles.innerMargin} />
            <TextInput
                style={styles.textInput}
                mode='outlined'
                label="Password"
                secureTextEntry
                maxLength={16}
                left={<TextInput.Icon name='lock' />}
                value={password}
                onChangeText={password => setPassword(password)}
            />
            <View style={styles.innerMargin} />
            <TouchableOpacity
                style={styles.buttonSubmit}
                disabled={loading ? true : false}
                onPress={() => login()}
            >
                {loading ? 
                    <ActivityIndicator color={'white'} />
                    : <Text style={styles.btnText}>LOGIN</Text>
                }
            </TouchableOpacity>
            <View style={styles.innerMargin} />
            <TouchableOpacity
                style={styles.btn2}
                disabled={loading ? true : false}
                onPress={() => navigation.navigate("RegisterScreen")}
            >
                <Text style={styles.btnText2}>Create a new Account!</Text>
            </TouchableOpacity>
        </View>
    )
}

export default LoginScreen

const WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: 'white'
    },
    textInput: {
        width: WIDTH - 40,
        borderRadius: 4,
        backgroundColor: 'white'
    },
    innerMargin: {
        height: 15
    },
    buttonSubmit: {
        height: 45,
        width: WIDTH - 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.DARK2,
        borderRadius: 4
    },
    btnText: {
        color: "#FFF",
        fontSize: 15,
        fontWeight: "500"
    },
    btn2: {
        height: 30,
        width: WIDTH - 40,
        alignItems: "center",
        justifyContent: "center"
    },
    btnText2: {
        fontSize: 14,
        fontWeight: "500",
        color: Colors.BLUE
    }
})