import React from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { useNavigation, StackActions } from "@react-navigation/native";
import Parse from "parse/react-native";

const AddTransactionScreen = () => {

    const navigation = useNavigation()

    const logout = async () => {
        return await Parse.User.logOut()
        .then(async () => {
            const currentUser = await Parse.User.currentAsync()
            navigation.reset({
                index: 0,
                routes: [{name: "AuthScreen"}]
            })
            return true
        })
        .catch((error) => {
            Alert.alert("Error!", error.message)
            return false
        })
    }

    return (
        <View style={styles.container}>
            <Text>AddTransactionScreen</Text>
            <Button
                title="Logout"
                onPress={() => logout()}
            />
        </View>
    )
}

export default AddTransactionScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 14,
        justifyContent: 'center',
        alignItems: 'center'
    }
})