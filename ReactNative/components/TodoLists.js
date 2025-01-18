import React, { useState, useContext } from "react";
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity, Pressable } from "react-native";
import { editItem, deleteItem, calculateProgress } from "./Components";
import { getTodoLists, createTodoList, updateTodoList , deleteTodoList} from "../api/TodoLists";
import { getTodoListStats } from "../api/TodoItems";
import { TokenContext, UsernameContext } from "../Context/Context";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

export default function TodoLists({ navigation }) {
  const [todoLists, setTodoLists] = useState([]);
  const [todoListName, setTodoListName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [token] = useContext(TokenContext);
  const [username] = useContext(UsernameContext);

  useFocusEffect(
    React.useCallback(() => {
      if (token) {
        getTodoLists(username, token)
          .then(async (data) => {
            const listsWithStats = await Promise.all(
              data.map(async (list) => {
                try {
                  const stats = await getTodoListStats(list.id, token);
                  return {
                    ...list,
                    totalTasks: stats.count || 0,
                    completedTasks: stats.completed || 0,
                  };
                } catch (error) {
                  console.error(`Erreur pour la liste ${list.title} :`, error);
                  return { ...list, totalTasks: 0, completedTasks: 0 };
                }
              })
            );
            setTodoLists(listsWithStats);
          })
          .catch(() => setErrorMessage("Erreur lors de la récupération des listes."));
      }
    }, [token, username])
  );

  const editTodoList = (id, newText) => {
    if (!newText || !newText.trim()) {
      setErrorMessage("Le texte ne peut pas être vide.");
      return;
    }
  
    editItem(
      id,
      editTitle, 
      todoLists, 
      setTodoLists, 
      (id, updateData, token) => updateTodoList(id, { title: updateData }, token),
      token,
      setErrorMessage,
      "TodoLists"
    );
  };
  

  const addTodoList = () => {
    if (!todoListName.trim()) {
      setErrorMessage("Le nom de la liste est obligatoire.");
      return;
    }

    createTodoList(username, todoListName.trim(), token)
      .then((newList) => {
        setTodoLists([...todoLists, { ...newList, totalTasks: 0, completedTasks: 0 }]);
        setTodoListName("");
        setIsAdding(false);
        setErrorMessage("");
      })
      .catch(() =>{setErrorMessage("Erreur lors de l'ajout de la liste.")});
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes listes</Text>
        <Pressable style={styles.addButton} onPress={() => setIsAdding(!isAdding)}>
          <Text style={styles.addButtonText}>+ Nouveau</Text>
        </Pressable>
      </View>

      {isAdding && (
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.textInput, errorMessage ? styles.textInputError : null]}
            onChangeText={(text) => {
              setTodoListName(text);
              if (text.trim()) setErrorMessage("");
            }}
            onSubmitEditing={addTodoList}
            value={todoListName}
            placeholder="Nom de la nouvelle liste"
            placeholderTextColor={errorMessage ? "#FF4500" : "#aaa"}
          />
          <TouchableOpacity style={styles.confirmButton} onPress={addTodoList}>
            <FontAwesome name="check" size={18} color="#1C1C1C" />
          </TouchableOpacity>
        </View>
      )}

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <FlatList
        data={todoLists}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                {calculateProgress(
                  Array(item.completedTasks)
                    .fill({ done: true })
                    .concat(
                      Array(item.totalTasks - item.completedTasks).fill({ done: false })
                    )
                )}
                %
              </Text>
            </View>
            <View style={styles.taskInfo}>
              {editingId === item.id ? (
               <TextInput
               style={styles.editInput}
               value={editTitle}
               onChangeText={setEditTitle}
               onSubmitEditing={() => {
                editTodoList(item.id, editTitle);
                setEditingId(null); // Réinitialiser l'état d'édition
              }}
             />
           ) : (
             
             <TouchableOpacity
               onPress={() =>
                 navigation.navigate("TodoList", { todoListId: item.id, todoListTitle: item.title })
               }
             >
               <Text style={styles.taskTitle}>{item.title}</Text>
             </TouchableOpacity>
           )}
         </View>
         <View style={styles.iconButtons}>
           {editingId === item.id ? (
             <TouchableOpacity
             onPress={() => {
              editTodoList(item.id, editTitle);
              setEditingId(null); 
            }}
               style={styles.iconButton}
             >
               <FontAwesome name="check" size={16} color="#B8860B" />
             </TouchableOpacity>
           ) : (
             <TouchableOpacity
               onPress={() => {
                 setEditingId(item.id);
                 setEditTitle(item.title);
               }}
               style={styles.iconButton}
             >
               <FontAwesome name="edit" size={16} color="#B8860B" />
             </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() =>
                  deleteItem(item.id, todoLists, setTodoLists, deleteTodoList, token, setErrorMessage)
                }
                style={styles.iconButton}
              >
                <FontAwesome name="trash" size={16} color="#B22222" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E2E2E',
  },
  header: {
    width: '90%',
    maxWidth: 500,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(28, 28, 28, 0.9)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DAA520',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F0EAD6',
  },
  addButton: {
    backgroundColor: '#DAA520',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#1C1C1C',
    fontWeight: 'bold',
    fontSize: 14,
  },
  inputContainer: {
    width: '90%',
    maxWidth: 500,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  textInput: {
    flex: 1,
    backgroundColor: 'rgba(28, 28, 28, 0.9)',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#F0EAD6',
    borderWidth: 1,
    borderColor: '#DAA520',
  },
  confirmButton: {
    backgroundColor: '#DAA520',
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: "#FF4500",
    fontSize: 14,
    marginBottom: 10,
    alignSelf: "center",
  },
  listItem: {
    color: "#F0EAD6",
    fontSize: 16,
    marginVertical: 5,
  },
  listContent: {
    width: '90%',
    maxWidth: 500,
    alignSelf: 'center',
    paddingBottom: 15,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(28, 28, 28, 0.9)',
    marginVertical: 6,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DAA520',
    width: '100%',
  },
  progressContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: 'rgba(218, 165, 32, 0.2)',
    marginRight: 10,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#DAA520',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontWeight: '500',
    fontSize: 16,
    color: '#F0EAD6',
  },
  editInput: {
    backgroundColor: 'rgba(28, 28, 28, 0.9)',
    padding: 8,
    borderRadius: 8,
    fontSize: 16,
    color: '#F0EAD6',
    borderWidth: 1,
    borderColor: '#DAA520',
  },
  iconButtons: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  iconButton: {
    marginLeft: 8,
  },
});
