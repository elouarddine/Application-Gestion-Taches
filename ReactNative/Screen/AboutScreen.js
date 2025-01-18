import React, { useState } from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function AboutScreen({navigation}) {
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setModalVisible(true); 
    }, [])
  );

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>À Propos de l'Application</Text>
            <Text style={styles.modalText}>
              Cette application a été développée pour aider les utilisateurs à organiser et gérer leurs tâches facilement.
            </Text>
            <Text style={styles.modalText}>
              <Text style={{ fontWeight: 'bold'  , color :'#DAA520'}}>Créateurs :</Text> Salah Eddine Elouardi, Aimad Lahbib
            </Text>
            <Text style={styles.modalText}>
              <Text style={{ fontWeight: 'bold' , color :'#DAA520'}}>Date de création :</Text> 15 Novembre 2024
            </Text>
            <Text style={styles.modalText}>
              <Text style={{ fontWeight: 'bold' , color :'#DAA520'}}>Objectif :</Text> Fournir une application de gestion de tâches intuitive et efficace.
            </Text>
            
            <Pressable
              style={[styles.button, styles.closeButton]}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('Accueil'); 
              }}
            >
              <Text style={styles.textStyle}>Fermer</Text>
            </Pressable>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    marginBottom: 10,
    textAlign: 'center',
    color: 'gray',
    fontSize: 16,
  },
  button: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  closeButton: {
    backgroundColor: '#A9A9A9', 
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
