import { useState, useEffect } from "react";

function ToDoList() {
    const [todos, setTodos] = useState(() => {
        const saved = localStorage.getItem("todos");
        return saved ? JSON.parse(saved) : [
            { id: 1, text: "Go to the gym", completed: false },
            { id: 2, text: "Buy groceries", completed: false },
            { id: 3, text: "Finish React project", completed: false },
        ];
    });

    const [input, setInput] = useState("");

    // Save to localStorage every time todos changes
    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    const addTodo = () => {
        if (!input.trim()) return;
        setTodos(prev => [...prev, { id: Date.now(), text: input, completed: false }]);
        setInput("");
    };

    const toggleTodo = (id) => {
        setTodos(prev =>
            prev.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo)
        );
    };

    const deleteTodo = (id) => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
    };

    return (
        <div className="flex justify-center items-center h-screen flex-col gap-4 bg-amber-50">
            <div className="border-2 p-4 rounded-2xl overflow-y-auto max-h-100 bg-white shadow-lg">
                   <h1 className="text-2xl font-bold text-gray-800 pb-4 text-center">To Do</h1>

            {/* Input */}
            <div className="flex gap-2 pb-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTodo()}
                    placeholder="Add a new task..."
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-400 w-64"
                />
                <button
                    onClick={addTodo}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
                >
                    Add 
                </button>
            </div>

            {/* List */}
            <ul className="flex flex-col gap-2 w-80">
                {todos.length === 0 && (
                    <p className="text-center text-gray-400 text-sm">No tasks yet!</p>
                )}
                {todos.map(todo => (
                    <li
                        key={todo.id}
                        className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm"
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => toggleTodo(todo.id)}
                                className="accent-blue-500 w-4 h-4 cursor-pointer"
                            />
                            <span className={`text-sm ${todo.completed ? "line-through text-gray-400" : "text-gray-700"}`}>
                                {todo.text}
                            </span>
                        </div>
                        <button
                            onClick={() => deleteTodo(todo.id)}
                            className="text-gray-300 hover:text-red-500 transition text-lg"
                        >
                            ✕
                        </button>
                    </li>
                ))}
            </ul>

            {/* Footer count */}
            {todos.length > 0 && (
                <p className="text-xs text-gray-400">
                    {todos.filter(t => t.completed).length} of {todos.length} completed
                </p>
            )}
        </div>
            </div>
         
    );
}

export default ToDoList;