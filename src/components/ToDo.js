import React, { useState } from 'react';
import './ToDo.css';

function ToDoApp() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ description: '', priority: 'low' });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState(null); 

  const addTask = () => {
    if (newTask.description.trim()) {
      setTasks([...tasks, newTask]);
      resetNewTask();
    }
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const startEditing = (index) => {
    setNewTask(tasks[index]); 
    setEditingIndex(index);
  };

  const updateTask = () => {
    const updatedTasks = tasks.map((task, i) => (i === editingIndex ? newTask : task));
    setTasks(updatedTasks);
    resetNewTask();
  };

  const resetNewTask = () => {
    setNewTask({ description: '', priority: 'low' });
    setEditingIndex(null); 
  };

  const filteredTasks = tasks.filter(task =>
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const priorityColor = {
    high: 'red',
    medium: 'yellow',
    low: 'green'
  };

  return (
    <div className="main">
      <div className="todo-app">
        <h2>My To-Do List</h2>
        
        <div className="task-input">
          <input
            type="text"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            placeholder="Add a new task"
          />
          <select
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button onClick={editingIndex !== null ? updateTask : addTask} className="btn">
            {editingIndex !== null ? 'Update Task' : 'Add Task'}
          </button>
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tasks"
          className="search-bar"
        />

        <ul>
          {filteredTasks.map((task, index) => (
            <li key={index} style={{ color: priorityColor[task.priority] }}>
              <span>{task.description} - {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
              <div className="action-btns">
                <button className="remove" onClick={() => removeTask(index)}>Remove</button>
                <button className="update" onClick={() => startEditing(index)}>Update</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ToDoApp;
