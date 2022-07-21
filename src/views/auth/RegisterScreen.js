import React, {useState} from "react";
import { ActivityIndicator, Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from "react-native-paper";
import Colors from "../../constants/Colors";
import Parse from "parse/react-native";
import { useNavigation } from "@react-navigation/native";

const RegisterScreen = ({navigation}) => {

    //const navigation = useNavigation()
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const register = async () => {
        const emailValue = email.trim()
        const usernameValue = username.trim()
        const passwordValue = password.trim()

        if(emailValue == "" || usernameValue == "" || passwordValue == "") {
            Alert.alert("Error!", "Inputs cannot be empty!")
        } else if (passwordValue.length < 8) {
            Alert.alert("Error!", "Password must be atleast 8 characters!")
        } else {
            setLoading(true)
            return await Parse.User.signUp(usernameValue, passwordValue, {
                email: emailValue
            })
                .then(async () => {
                    Alert.alert("Verification email has been sent to your email!")
                    await Parse.User.logOut()
                    return true
                })
                .catch((error) => {
                    Alert.alert("Error!", error.message)
                    return false
                })
                .finally(() => {
                    setEmail("")
                    setUsername("")
                    setPassword("")
                    setLoading(false)
                })
        }
    }

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 32, fontWeight: '600'}}>Sign Up</Text>
            <View style={styles.innerMargin} />
            <TextInput
                style={styles.textInput}
                mode='outlined'
                label="Enter Email"
                keyboardType="email-address"
                left={<TextInput.Icon name='email' />}
                value={email}
                onChangeText={email => setEmail(email)}
            />
            <View style={styles.innerMargin} />
            <TextInput
                style={styles.textInput}
                mode='outlined'
                label="Set Username"
                maxLength={16}
                left={<TextInput.Icon name='account' />}
                value={username}
                onChangeText={username => setUsername(username)}
            />
            <View style={styles.innerMargin} />
            <TextInput
                style={styles.textInput}
                mode='outlined'
                label="Set Password"
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
                onPress={() => register()}
            >
                {loading ?
                    <ActivityIndicator color={'white'}/>
                    : <Text style={styles.btnText}>REGISTER</Text>
                }
            </TouchableOpacity>
            <View style={styles.innerMargin} />
            <TouchableOpacity
                style={styles.btn2}
                disabled={loading ? true : false}
                onPress={() => navigation.navigate('LoginScreen')}
            >
                <Text style={styles.btnText2}>Already have an account? Login!</Text>
            </TouchableOpacity>
        </View>
    )
}

export default RegisterScreen

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
        borderRadius: 4,
        flexDirection: 'row'
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