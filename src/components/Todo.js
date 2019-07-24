import React, { Fragment, useState, useEffect, useReducer, useRef } from "react";
import axios from "axios";

const Todo = () => {
//   const [todoName, setTodoName] = useState("");
  //   const [todoList, setTodoList] = useState([]);
  //   const [submittedTodo, setSubmittedTodo] = useState(false);

  const todoInputRef = useRef();

  const todoListReducer = (state, action) => {
    switch (action.type) {
      case "SET":
        return action.payload;
      case "ADD":
        return state.concat(action.payload);
      case "REMOVE":
        return state.filter(todo => todo.id !== action.itemId);
      default:
        return state;
    }
  };

  const [todoList, dispatch] = useReducer(todoListReducer, []);

  useEffect(() => {
    axios
      .get("https://react-hooks-exercise.firebaseio.com/todos.json")
      .then(res => {
        console.log(res);
        const todoData = res.data;
        let todos = [];
        for (let key in todoData) {
          todos.push({
            id: key,
            name: todoData[key].name
          });
        }
        dispatch({ type: "SET", payload: todos });
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const handleMouseMove = e => {
    console.log(e.pageX, e.pageY);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  //   useEffect(() => {
  //     if (submittedTodo) {
  //       dispatch({ type: "ADD", payload: submittedTodo });
  //     }
  //   }, [submittedTodo]);

//   const hanleTodoChange = event => {
//     setTodoName(event.target.value);
//   };

  const handleAddTodo = () => {
    const todoName = todoInputRef.current.value;

    axios
      .post("https://react-hooks-exercise.firebaseio.com/todos.json", {
        name: todoName
      })
      .then(res => {
        console.log(res);
        setTimeout(() => {
          const todoItem = { id: res.data.name, name: todoName };
          dispatch({ type: "ADD", payload: todoItem });
          // setTodoName("");
        }, 3000);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const removeTodoHandler = todoId => {
    axios
      .delete(
        `https://react-hooks-exercise.firebaseio.com/todos/${todoId}.json`
      )
      .then(res => {
        dispatch({ type: "REMOVE", itemId: todoId });
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <Fragment>
      <input type="text" ref={todoInputRef} />
      <button type="button" onClick={handleAddTodo}>
        Add
      </button>
      <br />
      <ul>
        {todoList.map(todo => {
          return (
            <li key={todo.id} onClick={removeTodoHandler.bind(this, todo.id)}>
              {todo.name}
            </li>
          );
        })}
      </ul>
    </Fragment>
  );
};

export default Todo;
