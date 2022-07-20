import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {

    const navigation = useNavigation()

    return (
        <View style={styles.container}>
            <Text>HomeScreen</Text>
            <Button
                title="Go To Logout"
                onPress={() => navigation.navigate('AddTransactionScreen')}
            />
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 14,
        justifyContent: 'center',
        alignItems: 'center'
    }
})