import React, { useState, useEffect } from "react";
import axios from 'axios';

function ToDoApp({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    description: '',
    priority: 'low',
  });

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/tasks/${user.id}`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask({
      ...newTask,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/tasks', {
        user_id: user.id,
        ...newTask,
      });
      setTasks([...tasks, { id: response.data.id, ...newTask }]);
      setNewTask({ description: '', priority: 'low' });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:3001/tasks/${id}`, {
        description: newTask.description,
        priority: newTask.priority,
      });
      setTasks(tasks.map(task => task.id === id ? { ...task, description: newTask.description, priority: newTask.priority } : task));
      setNewTask({ description: '', priority: 'low' });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div>
      <h2>Welcome, {user.username}</h2>
      <button onClick={onLogout}>Logout</button>
      <h4>To-Do List</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task description"
          name="description"
          value={newTask.description}
          onChange={handleChange}
        />
        <select name="priority" value={newTask.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span>{task.description} - {task.priority}</span>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
            <button onClick={() => handleUpdate(task.id)}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ToDoApp;