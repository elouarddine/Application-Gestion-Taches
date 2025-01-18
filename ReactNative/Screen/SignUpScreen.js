import React from 'react';
import { View, Text, StyleSheet , Pressable } from 'react-native';
import SignUp from '../components/SignUp';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpScreen({navigation}) {
    return (
        <View style={styles.container}>
            
                <SignUp />

            <Text style={styles.linkText}>
                 Vous avez déjà un compte ?{' '}   
                <Pressable onPress={() => navigation.navigate('Se connecter')}>
                    <Text style={styles.link}>Se connecter</Text>
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
        padding: 7,
    },
    link: {
        textDecorationLine: 'underline',
        color: '#DAA520', 
        fontWeight: 'bold',
    },
});

