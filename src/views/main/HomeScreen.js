import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View, FlatList, ActivityIndicator, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../../constants/Colors";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import NoResults from "../../components/NoResults";
import TransactionItem from "../../components/TransactionItem";
import Parse from "parse/react-native";

const HomeScreen = ({ route, navigation }) => {

    const isFocused = useIsFocused()
    //const { username } = route?.params || "no route"
    const [transactions, setTransactions] = useState([])
    const [refresh, setRefresh] = useState(false)
    const [loading, setLoading] = useState(false)
    const [balance, setBalance] = useState("0")
    const [profit, setProfit] = useState("0")
    const [expense, setExpense] = useState("0")
    const [username, setUsername] = useState("")

    //console.log(`username: ${username}`)

    const getCurrentUser = async () => {
        try {
            const user = await Parse.User.currentAsync()
            if(user !== null) {
                setUsername(user.get('username'))
            }
        } catch (error) {
            Alert.alert("Error!", error.message)
        }
    }

    const readTransactions = async () => {
        setLoading(true)
        getCurrentUser()
        console.log(`username: ${username}`)
        const parseQuery = new Parse.Query("Transactions")
        parseQuery.contains("username", username)

        try {
            let results = await parseQuery.find()
            let json = JSON.parse(JSON.stringify(results))
            var filteredJSON = json.filter(it => it.username === username)
            console.log(filteredJSON)
            setTransactions(json.reverse())
            totalPositive(results)
            totalNegative(results)
            calculateBalance(results)
            return true
        } catch (error) {
            Alert.alert("Error!", "Couldn't fetch data")
            return false
        } finally {
            setRefresh(false)
            setLoading(false)
        }
    }

    const onRefresh = () => {
        setRefresh(true)
        readTransactions()
    }

    useEffect(() => {
        isFocused && username && readTransactions() 
    }, [isFocused, username])

    const calculateBalance = (arr) => {
        var balance = 0
        if(arr != null) {
            arr.map(it => {
                balance = balance + it.get('amount')
            })
            setBalance(balance.toString())
        }
    }

    const totalPositive = (arr) => {
        var pos = 0;
        if(arr != null) {
            arr.map(it => {
                if(it.get('amount') >= 0) {
                    pos = pos + it.get('amount');
                }
            })
            setProfit(pos.toString())
        }
    }

    const totalNegative = (arr) => {
        var neg = 0;
        if(arr != null) {
            arr.map(it => {
                if(it.get('amount') < 0) {
                    neg = neg + it.get('amount');
                }
            })
            setExpense((neg * -1).toString())
        }
    }

    const logout = async () => {
        return await Parse.User.logOut()
        .then(async () => {
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

    const logoutAlert = () => {
        Alert.alert(
            "Confirmation", "Do you want to logout?",
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log("Cancel"),
                    style: "cancel",
                },
                {
                    text: 'OK',
                    onPress: () => logout()
                }
            ],
            {cancelable: true}
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.bottomContainer}>
                <Text style={{fontSize: 28, fontWeight: '700'}}>Hello {username}</Text>
                <TouchableOpacity
                    style={{alignSelf: 'flex-end'}}
                    onPress={() => logoutAlert()}
                >
                    <MaterialCommunityIcon size={28} name="logout" color={Colors.RED} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity>
                <LinearGradient
                    style={styles.card}
                    start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                    colors={['#0F2027', '#203A43', '#2C5364']}
                >
                    <View style={{flex: 1}}>
                        <View style={{flex: 1}}>
                            <Text style={styles.balanceCaption}>My Balance</Text>
                            <Text style={styles.balanceValue}>₹ {balance}</Text>
                        </View>
                        <View style={styles.bottomContainer}>
                            <Text style={styles.profitValue}>+ ₹{profit}</Text>
                            <Text style={styles.expenseValue}>- ₹{expense}</Text>
                        </View>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
            <View style={{flexDirection :'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30}}>
                <Text style={{fontSize: 24, fontWeight: '700'}}>Transactions</Text>
                <TouchableOpacity
                    style={{alignSelf: 'flex-end', marginEnd: 8}}
                    onPress={() => onRefresh()}
                >
                    <MaterialCommunityIcon size={30} name="reload" color={Colors.BLUE} />
                </TouchableOpacity>
            </View>
            <View style={{flex: 1}}>
                {loading ? <ActivityIndicator size={'large'} color={Colors.BLUE} /> : (
                    <FlatList
                        style={{flex: 1}}
                        data={transactions}
                        keyExtractor={({objectId}) => objectId}
                        onRefresh={onRefresh}
                        refreshing={refresh}
                        ListEmptyComponent={NoResults}
                        renderItem={({item}) => (
                            <TransactionItem item={item} />
                        )}
                    />
                )}
            </View>
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddTransactionScreen')}
            >
                <Feather name='plus' size={26} color='#FFF' />
            </TouchableOpacity>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: 'white',
    },
    card: {
        height: 220,
        backgroundColor: 'black',
        borderRadius: 22,
        paddingVertical: 14,
        paddingHorizontal: 20,
        elevation: 8,
        marginTop: 20
    },
    bottomContainer: {
        flexDirection :'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    balanceCaption : {
        color: Colors.WHITISH, 
        fontSize: 16
    },
    balanceValue: {
        color: 'white', 
        fontSize: 30, 
        fontWeight: '500', 
        marginTop: 4,
    },
    profitValue: {
        color: 'green', 
        fontSize: 20, 
        fontWeight: '500', 
    },
    expenseValue: {
        color: Colors.RED, 
        fontSize: 20, 
        fontWeight: '500', 
        alignSelf: 'flex-end'
    },
    fab: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        position: 'absolute',
        bottom: 45,
        right: 35,
        backgroundColor: Colors.DARK2,
        borderRadius: 100,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 4,
    }
})