import React from 'react'
import TodoLists from '../components/TodoLists.js'

export default function TodoListsScreen({navigation}){
    return (
        <TodoLists navigation={navigation} />
    )
}