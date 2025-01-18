
import API_URL from "./apiUrl.js";
import fetch from "node-fetch";

const GET_TODO_LIST_ITEMS = `
query GetTodoListItems($where: TodoWhere) {
  todos(where: $where) {
    id
    content
    done
  }
}
`;

export function getTodoListItems(todoListId, token) {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + token,
    },
    body: JSON.stringify({
      query: GET_TODO_LIST_ITEMS,
      variables: {
        where: {
          belongsTo: {
            id: todoListId,
          },
        },
      },
    }),
  })
    .then((response) => response.json())
    .then((jsonResponse) => {
      if (jsonResponse.errors != null) {
        throw jsonResponse.errors[0];
      }
      return jsonResponse.data.todos;
    })
    .catch((error) => {
      console.log('error API', error.message);
      throw error;
    });
}

// Requête pour créer un nouvel élément de tâche
const CREATE_TODO_ITEM = `
mutation CreateTodos($input: [TodoCreateInput!]!) {
  createTodos(input: $input) {
    todos {
      id
      content
      done
    }
  }
}
`;

export function createTodoItem(todoListId, content, token) {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + token,
    },
    body: JSON.stringify({
      query: CREATE_TODO_ITEM,
      variables: {
        input: [
          {
            content: content,
            done: false,
            belongsTo: {
              connect: {
                where: {
                  id: todoListId,
                },
              },
            },
          },
        ],
      },
    }),
  })
    .then((response) => response.json())
    .then((jsonResponse) => {
      if (jsonResponse.errors != null) {
        throw jsonResponse.errors[0];
      }
      return jsonResponse.data.createTodos.todos[0];
    })
    .catch((error) => {
      console.log('error API', error.message);
      throw error;
    });
}

// Requête pour mettre à jour un élément de tâche
const UPDATE_TODO_ITEM = `
mutation UpdateTodos($where: TodoWhere, $update: TodoUpdateInput) {
  updateTodos(where: $where, update: $update) {
    todos {
      id
      content
      done
    }
  }
}
`;

export function updateTodoItem(id, updateFields, token) {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({
      query: UPDATE_TODO_ITEM,
      variables: {
        where: {
          id: id,
        },
        update: updateFields,
      },
    }),
  })
    .then((response) => response.json())
    .then((jsonResponse) => {
      if (jsonResponse.errors != null) {
        throw jsonResponse.errors[0];
      }
      return jsonResponse.data.updateTodos.todos[0];
    })
    .catch((error) => {
      console.log('error API', error.message);
      throw error;
    });
}


// Requête pour supprimer un élément de tâche
const DELETE_TODO_ITEM = `
mutation DeleteTodos($where: TodoWhere) {
  deleteTodos(where: $where) {
    nodesDeleted
  }
}
`;

export function deleteTodoItem(id, token) {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + token,
    },
    body: JSON.stringify({
      query: DELETE_TODO_ITEM,
      variables: {
        where: {
          id: id,
        },
      },
    }),
  })
    .then((response) => response.json())
    .then((jsonResponse) => {
      if (jsonResponse.errors != null) {
        throw jsonResponse.errors[0];
      }
      return jsonResponse.data.deleteTodos.nodesDeleted;
    })
    .catch((error) => {
      console.log('error API', error.message);
      throw error;
    });
}



export function getTodoListStats(todoListId, token) {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + token,
    },
    body: JSON.stringify({
      query: GET_TODO_LIST_ITEMS,
      variables: {
        where: {
          belongsTo: {
            id: todoListId,
          },
        },
      },
    }),
  })
    .then((response) => response.json())
    .then((jsonResponse) => {
      if (jsonResponse.errors != null) {
        throw jsonResponse.errors[0];
      }
      const todos = jsonResponse.data.todos;
      const totalTasks = todos.length;
      const completedTasks = todos.filter(todo => todo.done).length;
      return { count: totalTasks, completed: completedTasks };
    })
    .catch((error) => {
      console.log('error API', error.message);
      throw error;
    });
}

