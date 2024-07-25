import React, { useState } from 'react';

function ToDoApp() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ description: '', priority: 'low' });
  const [searchTerm, setSearchTerm] = useState('');

  const addTask = () => {
    if (newTask.description.trim() !== '') {
      setTasks([...tasks, newTask]);
      setNewTask({ description: '', priority: 'low' });
    }
  };

  const removeTask = (index) => {
    const newTasks = tasks.filter((task, i) => i !== index);
    setTasks(newTasks);
  };

  const updateTask = (index, updatedTask) => {
    const newTasks = tasks.map((task, i) => (i === index ? updatedTask : task));
    setTasks(newTasks);
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
    <div className="todo-app">
      <h2>My To-Do List</h2>
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
      <button onClick={addTask} className='btn'>Add Task</button>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search tasks"
      />

      <ul>
        {filteredTasks.map((task, index) => (
          <li key={index} style={{ color: priorityColor[task.priority] }}>
            <input
              type="text"
              value={task.description}
              onChange={(e) => updateTask(index, { ...task, description: e.target.value })}
            />
            <select
              value={task.priority}
              onChange={(e) => updateTask(index, { ...task, priority: e.target.value })}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button onClick={() => removeTask(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ToDoApp;