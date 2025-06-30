import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Task, Priority, Subtask, CreateTaskData } from "../types";
import { apiService } from "../services/api";
import toast from "react-hot-toast";
import "./TaskForm.css";

interface TaskFormProps {
  task?: Task;
  onSave: (task: Task) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onCancel }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!task;

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setDueDate(task.dueDate.split("T")[0]);
      setPriority(task.priority);
      setSubtasks(task.subtasks);
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDueDate(tomorrow.toISOString().split("T")[0]);
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!dueDate) {
      toast.error("Due date is required");
      return;
    }

    setIsLoading(true);
    try {
      const taskData: CreateTaskData = {
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: new Date(dueDate).toISOString(),
        priority,
        subtasks,
      };

      let savedTask: Task;
      if (isEditing) {
        savedTask = await apiService.updateTask(task!._id, taskData);
        toast.success("Task updated successfully");
      } else {
        savedTask = await apiService.createTask(taskData);
        toast.success("Task created successfully");
      }

      onSave(savedTask);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to save task";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;

    const subtask: Subtask = {
      id: Date.now().toString(),
      title: newSubtask.trim(),
      completed: false,
    };

    setSubtasks([...subtasks, subtask]);
    setNewSubtask("");
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter((subtask) => subtask.id !== id));
  };

  const toggleSubtask = (id: string) => {
    setSubtasks(
      subtasks.map((subtask) =>
        subtask.id === id
          ? { ...subtask, completed: !subtask.completed }
          : subtask
      )
    );
  };

  return (
    <div className="taskform-overlay">
      <div className="taskform-container">
        <div className="taskform-content">
          <div className="taskform-header">
            <h2 className="taskform-title">
              {isEditing ? "Edit Task" : "Create New Task"}
            </h2>
            <button onClick={onCancel} className="taskform-close-button">
              <X className="taskform-close-icon" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="taskform-form">
            <div className="taskform-field">
              <label htmlFor="title" className="taskform-label">
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="taskform-input"
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="taskform-field">
              <label htmlFor="description" className="taskform-label">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="taskform-textarea"
                placeholder="Enter task description (optional)"
              />
            </div>

            <div className="taskform-grid">
              <div className="taskform-field">
                <label htmlFor="dueDate" className="taskform-label">
                  Due Date *
                </label>
                <input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="taskform-input"
                  required
                />
              </div>

              <div className="taskform-field">
                <label htmlFor="priority" className="taskform-label">
                  Priority
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="taskform-select"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="taskform-field">
              <label className="taskform-label">Subtasks</label>
              <div className="taskform-subtasks">
                {subtasks.map((subtask) => (
                  <div key={subtask.id} className="taskform-subtask">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => toggleSubtask(subtask.id)}
                      className="taskform-checkbox"
                    />
                    <span
                      className={`taskform-subtask-text ${
                        subtask.completed ? "taskform-subtask-completed" : ""
                      }`}
                    >
                      {subtask.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSubtask(subtask.id)}
                      className="taskform-delete-button"
                    >
                      <Trash2 className="taskform-delete-icon" />
                    </button>
                  </div>
                ))}

                <div className="taskform-add-subtask">
                  <input
                    type="text"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder="Add a subtask..."
                    className="taskform-subtask-input"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addSubtask())
                    }
                  />
                  <button
                    type="button"
                    onClick={addSubtask}
                    className="taskform-add-button"
                  >
                    <Plus className="taskform-add-icon" />
                  </button>
                </div>
              </div>
            </div>

            <div className="taskform-actions">
              <button
                type="button"
                onClick={onCancel}
                className="taskform-cancel-button"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="taskform-submit-button"
              >
                {isLoading
                  ? "Saving..."
                  : isEditing
                  ? "Update Task"
                  : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
