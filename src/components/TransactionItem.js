import React from "react";
import { StyleSheet, TouchableOpacity, View, Text, Alert, Image, Dimensions } from "react-native";
import Colors from "../constants/Colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Parse from "parse/react-native";

const TransactionItem = ({item}) => {

    const { objectId, label, amount, type, category, username } = item

    const deleteTransaction = async () => {
        let transaction = new Parse.Object('Transactions')
        transaction.set('objectId', objectId)

        try {
            await transaction.destroy()
            Alert.alert("Transaction deleted!")
            return true
        } catch (error) {
            Alert.alert("Error!", error.message)
            return false
        }
    }

    return (
        <TouchableOpacity
            style={styles.container}
        >
            <View style={styles.view1}>
                <Image
                    style={styles.logo}
                    source={category === "Income" ? require('../../assets/profits.png') :
                        category === "Food" ? require('../../assets/food.png') :
                        category === "Transportation" ? require('../../assets/transportation.png') :
                        category === "Entertainment" ? require('../../assets/entertainment.png') :
                        category === "Clothing" ? require('../../assets/clothing.png') :
                        category === "Subscriptions" ? require('../../assets/subscriptions.png') :
                        category === "Purchases" ? require('../../assets/purchase.png') :
                        category === "Bills" ? require('../../assets/bill.png') :
                        category === "Miscellaneous" ? require('../../assets/misc.png') :
                        require('../../assets/image.png')}
                    defaultSource={require('../../assets/image.png')}
                />
                <View style={styles.view2}>
                    <Text style={styles.label}>{label}</Text>
                    <Text 
                        style={{
                            fontSize: 20, 
                            fontWeight: '500', 
                            alignSelf: 'flex-end', 
                            color: type === "Income" ? 'green' : Colors.RED
                        }}
                    >
                        ₹{amount}
                    </Text>
                </View>
                <TouchableOpacity 
                    style={{alignSelf: 'flex-end'}}
                    onPress={() => deleteTransaction()}
                >
                    <Icon name="delete" size={26} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

export default TransactionItem

const WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        marginTop: 20,
    },
    view1: {
        flexDirection :'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    view2: {
        flexDirection :'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '75%',
        paddingHorizontal: 8
    },
    label: {
        fontSize: 20,
        fontWeight: '500'
    },
    amount: {
        fontSize: 20,
        fontWeight: '500',
        alignSelf: 'flex-end'
    },
    logo: {
        height: 32,
        width: 32
    }
})