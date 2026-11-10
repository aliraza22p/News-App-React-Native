import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Home from "../screens/Home";
import Health from "../screens/Health";
import Business from "../screens/Business";
import Sports from "../screens/Sports";
import Tech from "../screens/Tech";
import themeContext from "../config/themeContext";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    const theme = useContext(themeContext);

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: theme.accentColor,
                tabBarInactiveTintColor: theme.secondaryTextColor,
                tabBarStyle: {
                    height: 66,
                    paddingTop: 7,
                    paddingBottom: 8,
                    borderTopColor: theme.borderColor,
                    backgroundColor: theme.bottomTabColor
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '700'
                }
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" color={color} size={22} />)
                }}
            />
            <Tab.Screen
                name="Health"
                component={Health}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="heart" color={color} size={22} />)
                }}

            />
            <Tab.Screen
                name="Tech"
                component={Tech}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="hardware-chip" color={color} size={22} />)
                }}
            />
            <Tab.Screen
                name="Business"
                component={Business}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="logo-usd" color={color} size={22} />)
                }}
            />
            <Tab.Screen
                name="Sports"
                component={Sports}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="basketball" color={color} size={22} />)
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;