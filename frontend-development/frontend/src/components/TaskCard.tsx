import React, { useState } from "react";
import { format, isToday } from "date-fns";
import {
  Calendar,
  Flag,
  Edit,
  Trash2,
  Archive,
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import { Task, Priority, Status, Subtask } from "../types";
import { apiService } from "../services/api";
import toast from "react-hot-toast";
import "./TaskCard.css";

interface TaskCardProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onUpdate,
  onDelete,
  onEdit,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "High":
        return "taskcard-priority-high";
      case "Medium":
        return "taskcard-priority-medium";
      case "Low":
        return "taskcard-priority-low";
      default:
        return "taskcard-priority-default";
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "Completed":
        return "taskcard-status-completed";
      case "Active":
        return "taskcard-status-active";
      case "Archived":
        return "taskcard-status-archived";
      default:
        return "taskcard-status-default";
    }
  };

  const getDueDateColor = (dueDate: string) => {
    const date = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date < today) return "taskcard-duedate-overdue";
    if (isToday(date)) return "taskcard-duedate-today";
    return "taskcard-duedate-future";
  };

  const handleStatusToggle = async () => {
    setIsUpdating(true);
    try {
      const newStatus = task.status === "Completed" ? "Active" : "Completed";
      const updatedTask = await apiService.updateTask(task._id, {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        status: newStatus,
        archived: task.archived,
        subtasks: task.subtasks,
      });
      onUpdate(updatedTask);
      toast.success(`Task marked as ${newStatus.toLowerCase()}`);
    } catch (error: any) {
      toast.error("Failed to update task status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleArchiveToggle = async () => {
    setIsUpdating(true);
    try {
      const updatedTask = await apiService.archiveTask(
        task._id,
        !task.archived
      );
      onUpdate(updatedTask);
      toast.success(`Task ${task.archived ? "unarchived" : "archived"}`);
    } catch (error: any) {
      toast.error("Failed to archive task");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await apiService.deleteTask(task._id);
        onDelete(task._id);
        toast.success("Task deleted");
      } catch (error: any) {
        toast.error("Failed to delete task");
      }
    }
  };

  const handleSubtaskToggle = async (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.map((subtask) =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );

    try {
      const updatedTask = await apiService.updateSubtasks(
        task._id,
        updatedSubtasks
      );
      onUpdate(updatedTask);
    } catch (error: any) {
      toast.error("Failed to update subtask");
    }
  };

  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return;

    const newSubtaskObj: Subtask = {
      id: Date.now().toString(),
      title: newSubtask.trim(),
      completed: false,
    };

    const updatedSubtasks = [...task.subtasks, newSubtaskObj];

    try {
      const updatedTask = await apiService.updateSubtasks(
        task._id,
        updatedSubtasks
      );
      onUpdate(updatedTask);
      setNewSubtask("");
      toast.success("Subtask added");
    } catch (error: any) {
      toast.error("Failed to add subtask");
    }
  };

  const completedSubtasks = task.subtasks.filter(
    (subtask) => subtask.completed
  ).length;
  const totalSubtasks = task.subtasks.length;

  const getBorderClass = () => {
    if (task.status === "Completed") return "taskcard-completed";
    if (task.priority === "High") return "taskcard-high-priority";
    if (task.priority === "Medium") return "taskcard-medium-priority";
    return "taskcard-low-priority";
  };

  return (
    <div className={`taskcard-container ${getBorderClass()}`}>
      <div className="taskcard-content">
        <div className="taskcard-header">
          <div className="taskcard-main-content">
            <div className="taskcard-title-row">
              <button
                onClick={handleStatusToggle}
                disabled={isUpdating}
                className="taskcard-status-button"
              >
                {task.status === "Completed" ? (
                  <CheckCircle className="taskcard-check-icon" />
                ) : (
                  <Circle className="taskcard-circle-icon" />
                )}
              </button>

              <h3
                className={`taskcard-title ${
                  task.status === "Completed" ? "taskcard-title-completed" : ""
                }`}
              >
                {task.title}
              </h3>
            </div>

            {task.description && (
              <p className="taskcard-description">{task.description}</p>
            )}

            <div className="taskcard-meta">
              <span
                className={`taskcard-tag ${getPriorityColor(task.priority)}`}
              >
                <Flag className="taskcard-tag-icon" />
                {task.priority}
              </span>

              <span className={`taskcard-tag ${getStatusColor(task.status)}`}>
                {task.status}
              </span>

              <span
                className={`taskcard-duedate ${getDueDateColor(task.dueDate)}`}
              >
                <Calendar className="taskcard-duedate-icon" />
                {format(new Date(task.dueDate), "MMM dd, yyyy")}
              </span>

              {totalSubtasks > 0 && (
                <span className="taskcard-subtask-count">
                  {completedSubtasks}/{totalSubtasks} subtasks
                </span>
              )}
            </div>

            {task.subtasks.length > 0 && (
              <div className="taskcard-subtasks-section">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="taskcard-expand-button"
                >
                  {isExpanded ? (
                    <ChevronUp className="taskcard-chevron-icon" />
                  ) : (
                    <ChevronDown className="taskcard-chevron-icon" />
                  )}
                  Subtasks
                </button>

                {isExpanded && (
                  <div className="taskcard-subtasks-list">
                    {task.subtasks.map((subtask) => (
                      <div key={subtask.id} className="taskcard-subtask-item">
                        <button
                          onClick={() => handleSubtaskToggle(subtask.id)}
                          className="taskcard-subtask-toggle"
                        >
                          {subtask.completed ? (
                            <CheckCircle className="taskcard-subtask-checked" />
                          ) : (
                            <Circle className="taskcard-subtask-unchecked" />
                          )}
                        </button>
                        <span
                          className={`taskcard-subtask-title ${
                            subtask.completed
                              ? "taskcard-subtask-completed"
                              : ""
                          }`}
                        >
                          {subtask.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {isExpanded && (
              <div className="taskcard-add-subtask">
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Add subtask..."
                  className="taskcard-subtask-input"
                  onKeyPress={(e) => e.key === "Enter" && handleAddSubtask()}
                />
                <button
                  onClick={handleAddSubtask}
                  className="taskcard-add-subtask-button"
                >
                  <Plus className="taskcard-add-icon" />
                </button>
              </div>
            )}
          </div>

          <div className="taskcard-actions">
            <button
              onClick={() => onEdit(task)}
              className="taskcard-action-button taskcard-edit-button"
              title="Edit task"
            >
              <Edit className="taskcard-action-icon" />
            </button>

            <button
              onClick={handleArchiveToggle}
              disabled={isUpdating}
              className={`taskcard-action-button ${
                task.archived
                  ? "taskcard-unarchive-button"
                  : "taskcard-archive-button"
              }`}
              title={task.archived ? "Unarchive task" : "Archive task"}
            >
              <Archive className="taskcard-action-icon" />
            </button>

            <button
              onClick={handleDelete}
              className="taskcard-action-button taskcard-delete-button"
              title="Delete task"
            >
              <Trash2 className="taskcard-action-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
