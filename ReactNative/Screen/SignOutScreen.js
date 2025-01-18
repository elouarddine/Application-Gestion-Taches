import React, { useContext, useState } from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { TokenContext, UsernameContext } from '../Context/Context';

export default function SignOutScreen({ navigation }) {
  const [, setToken] = useContext(TokenContext);
  const [, setUsername] = useContext(UsernameContext);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setModalVisible(true);
    }, [])
  );

  const traitementDeSignOut = () => {
    setToken(null);
    setUsername(null);
    setModalVisible(false);
    navigation.navigate('Se connecter');
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Déconnexion</Text>
            <Text style={styles.modalText}>
              Êtes-vous sûr de vouloir vous déconnecter ?
            </Text>
            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false)
                  navigation.navigate('Accueil'); 
                }
              }
              >
                <Text style={styles.textStyle}>Annuler</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.signOutButton]}
                onPress={traitementDeSignOut}
              >
                <Text style={styles.textStyle}>Se déconnecter</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E2E2E', 
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#FFFFFF', 
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#DAA520', 
    shadowOpacity: 0.8,
    padding:20,
    elevation: 5,
    maxWidth: 420,
},

  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#B22222',
    marginBottom: 10,
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold', 
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#A9A9A9', 
  },
  signOutButton: {
    backgroundColor: '#FF4C4C', 

  },
});
