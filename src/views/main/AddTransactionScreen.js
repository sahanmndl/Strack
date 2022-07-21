import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator, Dimensions, TouchableOpacity, Alert } from "react-native";
import { TextInput } from "react-native-paper";
import Colors from "../../constants/Colors";
import Parse from "parse/react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

const AddTransactionScreen = () => {

    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const [username, setUsername] = useState("")
    const [label, setLabel] = useState("")
    const [amount, setAmount] = useState("")
    const [loading, setLoading] = useState(false)
    const [type, setType] = useState("")
    const [category, setCategory] = useState("")

    const getCurrentUser = async () => {
        const user = await Parse.User.currentAsync()
        if(user !== null) {
            setUsername(user.get('username'))
        } else {
            Alert.alert("Error!", "Cannot fetch username")
        }
    }

    const createTransaction = async () => {
        if(label == "" || amount == "") {
            Alert.alert("Error!", "Empty inputs!")
        } else if ((type === "Income") || (type === "Expense" && 
                    (category === "Food" || category === "Transportation" || category === "Entertainment" ||
                    category === "Clothing" || category === "Subscriptions" || category === "Purchases" || 
                    category === "Bills" || category === "Miscellaneous"))) {
            setLoading(true)
            const labelValue = label.trim()
            var amountValue = parseFloat(amount.trim())
            
            let transaction = new Parse.Object("Transactions")
            transaction.set('label', labelValue)
            transaction.set('type', type)
            transaction.set('username', username)

            if(type == "Income") {
                console.log(type, amountValue)
                if(amountValue <= 0) {
                    amountValue = amountValue * -1;
                }
                transaction.set('amount', amountValue)
                transaction.set('category', "Income")
            } else {
                console.log(type, category, amountValue)
                if(amountValue >= 0) {
                    amountValue = amountValue * -1;
                }
                transaction.set('amount', amountValue)
                transaction.set('category', category)
                console.log(type, category, amountValue)
            }

            try {
                await transaction.save()
                navigation.goBack()
                return true
            } catch (error) {
                Alert.alert(error.message)
                return false
            } finally {
                setLoading(false)
            }
        } else {
            Alert.alert("Please select valid type and category!")
        }
    }

    useEffect(() => {
        isFocused && getCurrentUser()
    }, [isFocused])

    return (
        <View style={styles.container}>
            <View style={styles.pickerContainer}>
                <Picker
                    style={styles.picker}
                    mode="dropdown"
                    selectedValue={type}
                    onValueChange={(val, index) => setType(val)}
                >
                    <Picker.Item label="Select Type" value="typeSelector" />
                    <Picker.Item label="Income" value="Income"/>
                    <Picker.Item label="Expense" value="Expense"/>
                </Picker>
                {
                    type === "Expense" ?
                    (
                        <Picker
                            style={styles.picker}
                            mode="dropdown"
                            selectedValue={category}
                            onValueChange={(val, index) => setCategory(val)}
                        >
                            <Picker.Item label="Select Category" value="categorySelector"/>
                            <Picker.Item label="Food and Drinks" value="Food"/>
                            <Picker.Item label="Transportation" value="Transportation"/>
                            <Picker.Item label="Entertainment" value="Entertainment"/>
                            <Picker.Item label="Clothing" value="Clothing"/>
                            <Picker.Item label="Subscriptions" value="Subscriptions"/>
                            <Picker.Item label="Purchases" value="Purchases"/>
                            <Picker.Item label="Bills" value="Bills"/>
                            <Picker.Item label="Miscellaneous" value="Miscellaneous"/>
                        </Picker>
                    ) : null
                }
            </View>
            <View style={styles.innerMargin} />
            <TextInput
                style={styles.textInput}
                mode='outlined'
                label="Label"
                maxLength={20}
                left={<TextInput.Icon name='label' />}
                value={label}
                onChangeText={label => setLabel(label)}
            />
            <View style={styles.innerMargin} />
            <TextInput
                style={styles.textInput}
                mode='outlined'
                label="Add Amount"
                maxLength={8}
                left={<TextInput.Icon name='numeric' />}
                keyboardType='numeric'
                value={amount}
                onChangeText={amount => setAmount(amount)}
            />
            <View style={styles.innerMargin} />
            <TouchableOpacity
                style={styles.buttonSubmit}
                disabled={loading ? true : false}
                onPress={() => createTransaction()}
            >
                {loading ? 
                    <ActivityIndicator color={'white'} />
                    : <Text style={styles.btnText}>SAVE</Text>
                }
            </TouchableOpacity>
        </View>
    )
}

export default AddTransactionScreen

const WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 10,
        backgroundColor: 'white'
    },
    textInput: {
        width: '100%',
        borderRadius: 4,
        backgroundColor: 'white'
    },
    innerMargin: {
        height: 15
    },
    buttonSubmit: {
        height: 45,
        width: '100%',
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
    pickerContainer: {
        justifyContent: "center",
        alignItems: "center"
    },
    picker: {
        width: WIDTH - 20,
        borderWidth: 1,
        backgroundColor: 'rgba(52, 52, 52, 0.0)',
    },
})