import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from '@react-navigation/native';
import SignIn from '../components/SignIn';
import { Ionicons } from '@expo/vector-icons';

export default function SignInScreen({navigation}) {

    return (
        <View style={styles.container}>
                <SignIn />
            <Text style={styles.linkText}>
                Voulez-vous vous inscrire à ToDo ?{' '}
                <Pressable onPress={() => navigation.navigate('S\'inscrire')}>
                    <Text style={styles.link}>S'inscrire</Text>
                </Pressable>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2E2E2E', 
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    linkText: {
        fontSize: 16,
        color: '#F0EAD6', 
        textAlign: 'center',
        padding: 14,

    },
    link: {
        textDecorationLine: 'underline',
        color: '#DAA520', 
        fontWeight: 'bold',
    },
});
