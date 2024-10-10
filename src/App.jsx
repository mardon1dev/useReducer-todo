import React, { useReducer, useState } from "react";

const TYPES = {
  ADD_ITEM: "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  UPDATE_ITEM: "UPDATE_ITEM",
  SAVED_ITEM: "SAVED_ITEM",
  LIKED_ITEM: "LIKED_ITEM",
};

const reducer = (state, action) => {
  if (action.type === TYPES.ADD_ITEM) {
    return {
      todos: [...state.todos, action.payload],
      liked: state.liked,
      saved: state.saved,
    };
  }
  if (action.type === TYPES.LIKED_ITEM) {
    const updatedTodos = state.todos.map((todo) => {
      if (todo.id === action.payload) {
        return { ...todo, isLiked: !todo.isLiked };
      }
      return todo;
    });

    const updatedLikedItem = updatedTodos.find(
      (item) => item.id === action.payload
    );

    return {
      todos: updatedTodos,
      liked: updatedLikedItem.isLiked
        ? [...state.liked, updatedLikedItem]
        : state.liked.filter((item) => item.id !== action.payload),
      saved: state.saved,
    };
  }

  if (action.type === TYPES.SAVED_ITEM) {
    const updatedTodos = state.todos.map((todo) => {
      if (todo.id === action.payload) {
        return { ...todo, isSaved: !todo.isSaved };
      }
      return todo;
    });
    const updatedLikedItem = updatedTodos.find(
      (item) => item.id === action.payload
    );
    return {
      todos: updatedTodos,
      liked: state.liked,
      saved: updatedLikedItem.isSaved
        ? [...state.saved, updatedLikedItem]
        : state.saved.filter((item) => item.id !== action.payload),
    };
  }
  if (action.type === TYPES.DELETE_ITEM) {
    const updatedTodos = state.todos.filter(
      (todo) => todo.id !== action.payload
    );
    const updatedLikedTodos = state.liked.filter(
      (item) => item.id !== action.payload
    );
    const updatedSavedTodos = state.saved.filter(
      (item) => item.id !== action.payload
    );
    return {
      todos: updatedTodos,
      liked: updatedLikedTodos,
      saved: updatedSavedTodos,
    };
  }
  if (action.type === TYPES.UPDATE_ITEM) {
    const updatedTodos = state.todos.map((todo) => {
      if (todo.id === action.payload.id) {
        return { ...todo, ...action.payload };
      }
      return todo;
    });
    return {
      todos: updatedTodos,
      liked: state.liked,
      saved: state.saved,
    };
  }

  return state;
};

const initialValues = {
  todos: [],
  liked: [],
  saved: [],
};

import "./App.css";
import { Button, Input } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  HeartFilled,
  HeartOutlined,
  SaveFilled,
  SaveOutlined,
} from "@ant-design/icons";
import ModalWrapper from "./components/Modal";

const App = () => {
  const [data, dispatch] = useReducer(reducer, initialValues);
  const [inputValue, setInputValue] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [currentEditId, setCurrentEditId] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (inputValue.trim().length > 0) {
      dispatch({
        type: TYPES.ADD_ITEM,
        payload: {
          id: Date.now(),
          title: inputValue,
          isLiked: false,
          isSaved: false,
        },
      });
      setInputValue("");
    } else {
      alert("Please enter a value");
    }
  }

  function handleDelete() {
    setDeleteModal(true);
  }

  function handleUpdate(todo) {
    setEditModal(true);
    setEditValue(todo.title);
    setCurrentEditId(todo.id);
  }

  function handleEditTodo(e) {
    e.preventDefault();
    dispatch({
      type: TYPES.UPDATE_ITEM,
      payload: {
        id: currentEditId,
        title: editValue,
      },
    });
    setEditModal(false);
    setEditValue("");
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-start py-[20px]">
      <form
        className="p-[10px] bg-blue-300 rounded flex items-center justify-between gap-3 w-[400px]"
        onSubmit={handleSubmit}
      >
        <Input
          type="text"
          name="title"
          className="w-[80%] h-full rounded"
          placeholder="Enter title"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          allowClear
        />
        <Button type="primary" htmlType="submit" className="p-2 w-[20%]">
          Add
        </Button>
      </form>
      <ul className="flex flex-col space-y-5 pt-5 w-[400px]">
        {data.todos.length == 0 ? (
          <p className="text-center text-gray-400">No todos</p>
        ) : (
          data.todos.map((item, index) => (
            <li
              key={index}
              className="flex flex-col items-start p-2 bg-[#000]/20 w-full rounded relative"
            >
              <span className="text-[15px] absolute top-2 left-2 bg-[#fff] px-2 rounded-full">
                {index + 1}
              </span>
              <p className="text-lg pl-[30px]">{item.title}</p>
              <div className="space-x-2 flex items-start justify-end w-full">
                <Button
                  onClick={() =>
                    dispatch({
                      type: TYPES.LIKED_ITEM,
                      payload: item.id,
                    })
                  }
                  color={item.isLiked ? "danger" : "default"}
                  variant={item.isLiked ? "filled" : "outline"}
                >
                  {item.isLiked ? (
                    <HeartFilled className="text-red-700" />
                  ) : (
                    <HeartOutlined className="text-red-500" />
                  )}
                </Button>
                <Button
                  onClick={() =>
                    dispatch({
                      type: TYPES.SAVED_ITEM,
                      payload: item.id,
                    })
                  }
                  color={item.isSaved ? "success" : "default"}
                  variant={item.isSaved ? "filled" : "outline"}
                >
                  {item.isSaved ? (
                    <SaveFilled className="text-blue-700" />
                  ) : (
                    <SaveOutlined className="text-blue-700" />
                  )}
                </Button>
                <Button
                  onClick={() => handleUpdate(item)}
                  color="default"
                  variant="outline"
                >
                  <EditOutlined className="text-green-700" />
                </Button>
                <ModalWrapper
                  openModal={editModal}
                  setOpenModal={setEditModal}
                  title={"Update todo"}
                >
                  <form onSubmit={handleEditTodo}>
                    <Input
                      type="text"
                      name="title"
                      className="h-full rounded"
                      placeholder="Enter title"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      allowClear
                    />
                    <div className="flex justify-end space-x-3 mt-5">
                      <Button
                        type="default"
                        color="default"
                        variant="default"
                        onClick={() => setEditModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="primary"
                        color="primary"
                        variant="filled"
                        className="!text-white !bg-green-800"
                        htmlType="submit"
                      >
                        Update todo
                      </Button>
                    </div>
                  </form>
                </ModalWrapper>
                <Button
                  onClick={() => handleDelete()}
                  color="danger"
                  variant="default"
                >
                  <DeleteOutlined className="text-red-500" />
                </Button>
              </div>
              <ModalWrapper
                openModal={deleteModal}
                setOpenModal={setDeleteModal}
                title={"Delete todo"}
              >
                <div className="">
                  <p className="text-sm text-gray-600 mb-8">
                    Are you sure you want to delete this todo?
                  </p>
                  <div className="flex justify-end space-x-3">
                    <Button
                      type="default"
                      color="default"
                      variant="default"
                      onClick={() => setDeleteModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      color="danger"
                      variant="filled"
                      onClick={() => {
                        dispatch({
                          type: TYPES.DELETE_ITEM,
                          payload: item.id,
                        });
                        setDeleteModal(false);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </ModalWrapper>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default App;
