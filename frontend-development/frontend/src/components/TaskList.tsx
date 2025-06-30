import React, { useState, useEffect } from "react";
import { Plus, Filter, Search, Archive } from "lucide-react";
import { Task, TaskFilters, Status, Priority } from "../types";
import { apiService } from "../services/api";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import toast from "react-hot-toast";
import "./TaskList.css";

interface TaskListProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
}

const TaskList: React.FC<TaskListProps> = ({ filters, onFiltersChange }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const fetchedTasks = await apiService.getTasks(filters);
      setTasks(fetchedTasks);
    } catch (error: any) {
      toast.error("Failed to fetch tasks");
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setShowTaskForm(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleSaveTask = (savedTask: Task) => {
    if (editingTask) {
      setTasks(
        tasks.map((task) => (task._id === savedTask._id ? savedTask : task))
      );
    } else {
      setTasks([savedTask, ...tasks]);
    }
    setShowTaskForm(false);
    setEditingTask(undefined);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(
      tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task._id !== taskId));
  };

  const handleCancelTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(undefined);
  };

  const filteredTasks = tasks.filter((task) => {
    if (!searchTerm) return true;
    return (
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description &&
        task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const activeTasks = filteredTasks.filter(
    (task) => !task.archived && task.status === "Active"
  );
  const completedTasks = filteredTasks.filter(
    (task) => !task.archived && task.status === "Completed"
  );
  const archivedTasks = filteredTasks.filter((task) => task.archived);

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(
      (task) => task.status === "Completed"
    ).length;
    const active = tasks.filter((task) => task.status === "Active").length;
    const overdue = tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      return dueDate < new Date() && task.status !== "Completed";
    }).length;

    return { total, completed, active, overdue };
  };

  const stats = getTaskStats();

  return (
    <div className="tasklist-container">
      {/* Header */}
      <div className="tasklist-header">
        <div>
          <h1 className="tasklist-title">Task Manager</h1>
          <p className="tasklist-subtitle">
            Organize and track your tasks efficiently
          </p>
        </div>
        <button onClick={handleCreateTask} className="tasklist-new-task-button">
          <Plus className="tasklist-button-icon" />
          New Task
        </button>
      </div>

      {/* Stats */}
      <div className="tasklist-stats-grid">
        <div className="tasklist-stat-card">
          <div className="tasklist-stat-value tasklist-stat-total">
            {stats.total}
          </div>
          <div className="tasklist-stat-label">Total Tasks</div>
        </div>
        <div className="tasklist-stat-card">
          <div className="tasklist-stat-value tasklist-stat-completed">
            {stats.completed}
          </div>
          <div className="tasklist-stat-label">Completed</div>
        </div>
        <div className="tasklist-stat-card">
          <div className="tasklist-stat-value tasklist-stat-active">
            {stats.active}
          </div>
          <div className="tasklist-stat-label">Active</div>
        </div>
        <div className="tasklist-stat-card">
          <div className="tasklist-stat-value tasklist-stat-overdue">
            {stats.overdue}
          </div>
          <div className="tasklist-stat-label">Overdue</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="tasklist-search-container">
        <div className="tasklist-search-row">
          <div
            className="tasklist-search-input-container"
            style={{ maxWidth: "320px", flex: "0 1 320px" }}
          >
            <Search className="tasklist-search-icon" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="tasklist-search-input"
              style={{ maxWidth: "100%" }}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`tasklist-filter-button${showFilters ? " active" : ""}`}
            aria-expanded={showFilters}
          >
            <Filter className="tasklist-button-icon" />
            Filters
          </button>
        </div>
        <div className={`tasklist-filter-options${showFilters ? "" : " hide"}`}>
          <div className="tasklist-filter-grid">
            <div>
              <label className="tasklist-filter-label">Status</label>
              <select
                value={filters.status || ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    status: (e.target.value as Status) || undefined,
                  })
                }
                className="tasklist-filter-select"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="tasklist-filter-label">Priority</label>
              <select
                value={filters.priority || ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    priority: (e.target.value as Priority) || undefined,
                  })
                }
                className="tasklist-filter-select"
              >
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="tasklist-filter-label">Archived</label>
              <select
                value={
                  filters.archived === undefined
                    ? ""
                    : filters.archived.toString()
                }
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    archived:
                      e.target.value === ""
                        ? undefined
                        : e.target.value === "true",
                  })
                }
                className="tasklist-filter-select"
              >
                <option value="">All Tasks</option>
                <option value="false">Active Only</option>
                <option value="true">Archived Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Task Lists */}
      {loading ? (
        <div className="tasklist-loading">
          <div className="tasklist-spinner"></div>
          <p className="tasklist-loading-text">Loading tasks...</p>
        </div>
      ) : (
        <div className="tasklist-sections">
          {/* Active Tasks */}
          {activeTasks.length > 0 && (
            <div className="tasklist-section">
              <div className="tasklist-section-header">
                <h2 className="tasklist-section-title">
                  Active Tasks ({activeTasks.length})
                </h2>
              </div>
              <div className="tasklist-cards">
                {activeTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                    onEdit={handleEditTask}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div className="tasklist-section">
              <div className="tasklist-section-header">
                <h2 className="tasklist-section-title">
                  Completed Tasks ({completedTasks.length})
                </h2>
              </div>
              <div className="tasklist-cards">
                {completedTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                    onEdit={handleEditTask}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Archived Tasks */}
          {archivedTasks.length > 0 && (
            <div className="tasklist-section">
              <div className="tasklist-section-header">
                <Archive className="tasklist-section-icon tasklist-archived-icon" />
                <h2 className="tasklist-section-title">
                  Archived Tasks ({archivedTasks.length})
                </h2>
              </div>
              <div className="tasklist-cards">
                {archivedTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                    onEdit={handleEditTask}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredTasks.length === 0 && !loading && (
            <div className="tasklist-empty">
              <h3 className="tasklist-empty-title">No tasks found</h3>
              <p className="tasklist-empty-text">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Get started by creating your first task"}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleCreateTask}
                  className="tasklist-empty-button"
                >
                  <Plus className="tasklist-button-icon" />
                  Create Task
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSave={handleSaveTask}
          onCancel={handleCancelTaskForm}
        />
      )}
    </div>
  );
};

export default TaskList;
