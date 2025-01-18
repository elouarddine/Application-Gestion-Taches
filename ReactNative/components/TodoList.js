import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import {
  getTodoListItems,
  createTodoItem,
  updateTodoItem,
  deleteTodoItem,
} from "../api/TodoItems";
import { TokenContext } from "../Context/Context";
import { deleteItem, calculateProgress , editItem } from "./Components";
import TodoItem from "./TodoItem";

export default function TodoList({ route }) {
  
  const { todoListId, todoListTitle } = route.params;

  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [filter, setFilter] = useState("all");
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [token] = useContext(TokenContext);

  useFocusEffect(
    React.useCallback(() => {
      if (token) {
      getTodoListItems(todoListId, token)
        .then((items) => {
          setTodos(items);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Erreur lors du chargement :", err);
          setError("Erreur lors du chargement des tâches.");
          setLoading(false);
        });
    }
  }, [token])
);

  const addNewTodo = () => {
    if (!newTodoText.trim()) {
      setError("La tâche ne peut pas être vide.");
      return;
    }

    createTodoItem(todoListId, newTodoText.trim(), token)
      .then((newItem) => {
        setTodos([...todos, newItem]);
        setNewTodoText("");
        setIsAdding(false);
        setError("");
      })
      .catch((err) => {
        setError("Erreur lors de l'ajout de la tâche.");
      });
  };


  const updateItem = (id) => {
    const itemToUpdate = todos.find((item) => item.id === id);
    if (!itemToUpdate) return;
  
    const newDoneStatus = !itemToUpdate.done;
  
    updateTodoItem(id, { done: newDoneStatus }, token) // Passez un objet avec `done`
      .then(() => {
        setTodos(
          todos.map((item) =>
            item.id === id ? { ...item, done: newDoneStatus } : item
          )
        );
      })
      .catch((error) =>
        console.error("Erreur lors de la mise à jour de la tâche :", error)
      );
  };
  
  const editTodoItem = (id, newText) => {
    if (!newText || !newText.trim()) {
      setError("Le texte ne peut pas être vide.");
      return;
    }
  
    editItem(
      id,
      newText.trim(), 
      todos,
      setTodos,
      updateTodoItem,
      token,
      setError,
      "TodoList" 
    );
  };
  

  const deleteTodo = (id) => {
    deleteItem(id, todos, setTodos, deleteTodoItem, token, setError);
  };

  const checkAllItems = () => {
    const promises = todos.map((item) =>
      updateTodoItem(item.id, { done: true }, token) 
        .then(() => ({ ...item, done: true })) 
        .catch((err) => {
          console.error(`Erreur pour l'élément ${item.id} :`, err);
          return item; 
        })
    );
  
    Promise.all(promises)
      .then((updatedTodos) => {
        setTodos(updatedTodos); 
      })
      .catch((err) => console.error("Erreur lors de la mise à jour groupée :", err));
  };

  
  const uncheckAllItems = () => {
    const promises = todos.map((item) =>
      updateTodoItem(item.id, { done: false }, token) 
        .then(() => ({ ...item, done: false })) 
        .catch((err) => {
          console.error(`Erreur pour l'élément ${item.id} :`, err);
          return item; 
        })
    );
  
    Promise.all(promises)
      .then((updatedTodos) => {
        setTodos(updatedTodos); 
      })
      .catch((err) => console.error("Erreur lors de la mise à jour groupée :", err));
  };
  
  const progress = calculateProgress(todos);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "checked") return todo.done;
    if (filter === "unchecked") return !todo.done;
    return true;
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Progression : {progress}%</Text>
        <View style={styles.progressBar}>
          <View
            style={{
              ...styles.progressFill,
              width: `${progress}%`,
            }}
          />
        </View>
        <Text style={styles.counterText}>
          Tâches réalisées : {todos.filter((todo) => todo.done).length}/{todos.length}
        </Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>{todoListTitle}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={() => setIsAdding(!isAdding)}>
            <Text style={styles.headerButtonText}>+ Nouveau</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={checkAllItems}>
            <Text style={styles.headerButtonText}>✔ Tout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={uncheckAllItems}>
            <Text style={styles.headerButtonText}>✘ Aucun</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isAdding && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ajouter une nouvelle tâche"
            placeholderTextColor="#aaa"
            value={newTodoText}
            onChangeText={(text) => {
              setNewTodoText(text);
              if (text.trim()) setError("");
            }}
          />
          <TouchableOpacity style={styles.confirmButton} onPress={addNewTodo}>
            <FontAwesome name="check" size={18} color="#1C1C1C" />
          </TouchableOpacity>
        </View>
      )}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.filterContainer}>
        <TouchableOpacity
          onPress={() => setFilter("all")}
          style={[
            styles.filterButton,
            filter === "all" && styles.filterButtonActive,
          ]}
        >
          <Text style={styles.filterButtonText}>Toutes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter("checked")}
          style={[
            styles.filterButton,
            filter === "checked" && styles.filterButtonActive,
          ]}
        >
          <Text style={styles.filterButtonText}>Terminées</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter("unchecked")}
          style={[
            styles.filterButton,
            filter === "unchecked" && styles.filterButtonActive,
          ]}
        >
          <Text style={styles.filterButtonText}>En cours</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTodos}
        renderItem={({ item }) => (
          <TodoItem
            item={item}
            editTodoItem={editTodoItem}
            deleteItem={deleteTodo}
            updateItem={updateItem}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}


const styles = StyleSheet.create({

  counterText: {
    color: '#F0EAD6',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 7,
  },
  container: {
    flex: 1,
    backgroundColor: '#2E2E2E',
  },
  progressContainer: {
    width: '90%',
    maxWidth: 500,
    alignSelf: 'center',
    marginVertical: 15,

  },
  progressText: {
    fontSize: 14,
    color: '#F0EAD6',
    marginBottom: 5,
    textAlign: 'center',

  },
  progressBar: {
    height: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#DAA520',
    borderRadius: 5,
  },
  
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#DAA520',
    marginTop: 10,
  },
  errorText: {
    color: "#FF4500",
    fontSize: 14,
    marginBottom: 10,
    alignSelf: "center",
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
},
headerButton: {
    backgroundColor: '#DAA520',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 8,
},
headerButtonText: {
    color: '#1C1C1C',
    fontWeight: 'bold',
    fontSize: 12,
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
  filterContainer: {
    width: '90%',
    maxWidth: 500,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(28, 28, 28, 0.9)',
    borderWidth: 1,
    borderColor: '#DAA520',
  },
  filterButtonActive: {
    backgroundColor: '#DAA520',
    borderColor: '#DAA520',
  },
  filterButtonText: {
    color: '#F0EAD6',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContent: {
    width: '90%',
    maxWidth: 500,
    alignSelf: 'center',
    paddingBottom: 15,
  },
});
