import { useState, useEffect } from 'react';
import './index.css';

function TodoList() {
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [
            { text: 'Learn React', completed: false },
            { text: 'Build a TODO App', completed: false },
            { text: 'Deploy the App', completed: false }
        ];
    });
    const [newTask, setNewTask] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [editText, setEditText] = useState('');
    const [filter, setFilter] = useState('All');
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });

    useEffect(() => {
        document.documentElement.classList.toggle('dark-mode', darkMode);
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const startEditing = (index) => {
        setEditingIndex(index);
        setEditText(tasks[index].text);
    };

    const saveEdit = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].text = editText;
        setTasks(updatedTasks);
        setEditingIndex(null);
    };

    const toggleCompletion = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].completed = !updatedTasks[index].completed;
        setTasks(updatedTasks);
    };

    const addTask = () => {
        if (newTask.trim() === '') return;
        setTasks([...tasks, { text: newTask, completed: false }]);
        setNewTask('');
    };

    const deleteTask = (index) => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'Completed') return task.completed;
        if (filter === 'Pending') return !task.completed;
        return true;
    });

    return (
        <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
            <h2>Fredo Todo-List</h2>
            <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <div className="filter-buttons">
                <button onClick={() => setFilter('All')}>All</button>
                <button onClick={() => setFilter('Completed')}>Completed</button>
                <button onClick={() => setFilter('Pending')}>Pending</button>
            </div>
            <div className="add-task">
                <input 
                    type="text" 
                    value={newTask} 
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task..."
                />
                <button onClick={addTask}>Add</button>
            </div>
            <ul className="task-list">
                {filteredTasks.map((task, index) => (
                    <li key={index} className="task-item">
                        <input type="checkbox" checked={task.completed} onChange={() => toggleCompletion(index)} />
                        {editingIndex === index ? (
                            <>
                                <input 
                                    type="text" 
                                    value={editText} 
                                    onChange={(e) => setEditText(e.target.value)}
                                />
                                <button onClick={() => saveEdit(index)}>Save</button>
                                <button onClick={() => setEditingIndex(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <span className={task.completed ? 'completed-task' : ''}>{task.text}</span> 
                                <button onClick={() => startEditing(index)}>Edit</button>
                                <button onClick={() => deleteTask(index)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoList;