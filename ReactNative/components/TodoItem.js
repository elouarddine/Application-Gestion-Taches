import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function TodoItem({ item, editTodoItem, updateItem, deleteItem }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.content);

  const saveEdit = () => {
    if (editText.trim()) {
      editTodoItem(item.id, editText); 
      setIsEditing(false); 
    }
  };

  return (
    <View style={styles.taskContainer}>
      <TouchableOpacity
        onPress={() => updateItem(item.id)} 
        style={styles.checkboxContainer}
      >
        {item.done ? (
          <FontAwesome name="check-circle" size={16} color="#B8860B" />
        ) : (
          <FontAwesome name="circle-thin" size={16} color="#555" />
        )}
      </TouchableOpacity>

      {isEditing ? (
        <TextInput
          style={styles.editInput}
          value={editText}
          onChangeText={setEditText}
          onSubmitEditing={saveEdit}
          placeholder="Modifier la tâche"
          placeholderTextColor="#aaa"
        />
      ) : (
        <Text style={[styles.taskTitle, item.done && styles.taskTitleDone]}>{item.content}</Text>
      )}

      <View style={styles.iconButtons}>
        {isEditing ? (
          <TouchableOpacity onPress={saveEdit} style={styles.iconButton}>
            <FontAwesome name="check" size={16} color="#1C1C1C" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.iconButton}>
            <FontAwesome name="edit" size={16} color="#B8860B" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.iconButton}>
          <FontAwesome name="trash" size={16} color="#B22222" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    taskContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1C',
        marginVertical: 6,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333',
        width: '100%',
    },
    checkboxContainer: {
        marginRight: 8,
    },
    taskTitle: {
        flex: 1,
        fontSize: 14,
        color: '#FFFFFF',
    },
    taskTitleDone: {
        textDecorationLine: 'line-through',
        color: '#777',
    },
    iconButtons: {
        flexDirection: 'row',
    },
    iconButton: {
        marginLeft: 8,
    },
    editInput: {
        flex: 1,
        backgroundColor: '#333',
        color: '#FFFFFF',
        fontSize: 14,
        padding: 8,
        borderRadius: 5,
        marginRight: 8,
    },
});
