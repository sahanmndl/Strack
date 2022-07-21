import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { StatusBar, Alert } from "react-native";
import Parse from 'parse/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_KEYS from "./src/constants/API_KEYS";
import SplashScreen from './src/views/auth/SplashScreen';
import RegisterScreen from './src/views/auth/RegisterScreen';
import LoginScreen from './src/views/auth/LoginScreen';
import HomeScreen from "./src/views/main/HomeScreen";
import AddTransactionScreen from "./src/views/main/AddTransactionScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';

//backend setup
Parse.setAsyncStorage(AsyncStorage)
Parse.initialize(API_KEYS.APP_ID, API_KEYS.JS_KEY)
Parse.serverURL = 'https://parseapi.back4app.com/'

const Stack = createStackNavigator()

function AuthNavigator() {
  return (
      <Stack.Navigator initialRouteName="SplashScreen">
          <Stack.Screen 
              name="SplashScreen"
              component={SplashScreen}
              options={{headerShown: false}}
          />
          <Stack.Screen 
              name="RegisterScreen"
              component={RegisterScreen}
              options={{title: ""}}
          />
          <Stack.Screen 
              name="LoginScreen"
              component={LoginScreen}
              options={{title: ""}}
          />
          <Stack.Screen
              name="MainScreen"
              component={MainNavigator}
              options={{headerShown: false}}
          />
      </Stack.Navigator>
  )
}

function MainNavigator() {
  return (
      <Stack.Navigator initialRouteName="HomeScreen">
          <Stack.Screen 
              name="HomeScreen"
              component={HomeScreen}
              options={{headerShown: false}}
          />
          <Stack.Screen 
              name="AddTransactionScreen"
              component={AddTransactionScreen}
              options={{title: "Add Transaction"}}
          />
          <Stack.Screen
              name="AuthScreen"
              component={AuthNavigator}
              options={{headerShown: false}}
          />
      </Stack.Navigator>
  )
}

export default function App() {

    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(false)

    const fetchCurrentUser = async () => {
        setLoading(true)
        try {
            const user = await Parse.User.currentAsync()
            if(user !== null) {
                setCurrentUser(user)
            } else {
                setCurrentUser(null)
            }
        } catch (error) {
            Alert.alert("Error!", error.message)
        } finally {
            setLoading(false)
        }
        
        console.log(currentUser)
    }

    useEffect(() => {
        fetchCurrentUser()
    }, [currentUser])

    return (
        <NavigationContainer>
            <StatusBar barStyle={'dark-content'} backgroundColor='white' />
            {currentUser ? <MainNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    )
}

