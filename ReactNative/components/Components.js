import React from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function TabStyle(route) {
  return {
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      if (route.name === 'Accueil') {
        iconName = focused ? 'home' : 'home-outline';
      } else if (route.name === 'TodoLists') {
        iconName = focused ? 'list' : 'list-outline';
      } else if (route.name === 'Deconnexion') {
        iconName = focused ? 'log-out' : 'log-out-outline';
      } else if (route.name === 'Se connecter') {
        iconName = focused ? 'log-in' : 'log-in-outline';
      } else if (route.name === 'S\'inscrire') {
        iconName = focused ? 'person-add' : 'person-add-outline';
      } else if (route.name === 'A Propos') {
        iconName = focused ? 'information-circle' : 'information-circle-outline';
      }
      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: '#DAA520', 
    tabBarInactiveTintColor: '#F0EAD6', 
    tabBarStyle: {
      backgroundColor: '#1C1C1C', 
      height: 55,
      borderTopWidth: 2,
      borderTopColor: '#DAA520', 
      paddingTop: 5,
      paddingBottom: 8,
      shadowOpacity: 0.8,
      elevation: 5,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: 'bold',
      paddingBottom: 5,
      color: '#F0EAD6', 
    },
  };
}

export const editItem = (id, newText, items, setItems, updateFunction, token, setError, context) => {

  const itemToUpdate = items.find((item) => item.id === id);
  if (!itemToUpdate) {
    setError("Élément introuvable.");
    return;
  }

  const sanitizedText = typeof newText === "string" ? newText.trim() : newText;

  if (context === "TodoLists" && !sanitizedText) {
    setError("Le texte ne peut pas être vide.");
    return;
  }

  const updatedData =
    context === "TodoLists"
      ? sanitizedText 
      : { content: sanitizedText }; 

  updateFunction(id, updatedData, token)
    .then((updatedItem) => {
      const updatedItems = items.map((item) =>
        item.id === id
          ? {
              ...item,
              ...(context === "TodoLists"
                ? { title: sanitizedText }
                : { content: updatedItem.content }),
            }
          : item
      );
      setItems(updatedItems);
      setError("");
    })
    .catch(() => setError("Erreur lors de la mise à jour de l'élément."));
};


export const deleteItem = (id, items, setItems, deleteFunction, token, setError) => {
  deleteFunction(id, token)
    .then(() => {
      const updatedItems = items.filter(item => item.id !== id);
      setItems(updatedItems);
      setError("");
    })
    .catch(() => setError("Erreur lors de la suppression de l'élément."));
};

export const calculateProgress = (items) => {
  const totalItems = items.length;
  const completedItems = items.filter(item => item.done).length;
  return totalItems ? Math.round((completedItems / totalItems) * 100) : 0;
};
