import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UsernameContext } from '../Context/Context';

export default function HomeScreen() {
  const [username] = useContext(UsernameContext);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bienvenue !</Text>
      <Text style={styles.usernameText}>Vous êtes connecté en tant que {username}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E2E2E', 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#DAA520', 
    marginBottom: 10,
    textAlign: 'center',
  },
  usernameText: {
    fontSize: 20,
    color: '#F0EAD6', 
    textAlign: 'center',
  },
});

