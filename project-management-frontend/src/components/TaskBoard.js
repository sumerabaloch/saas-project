import React, { useState } from "react";
import { taskAPI } from "../services/api";
import TaskCard from "./TaskCard";
import CreateTaskModal from "./CreateTaskModal";
import "./TaskBoard.css";

const TaskBoard = ({
  projectId,
  tasks,
  onTaskCreated,
  onTaskUpdated,
  onTaskDeleted,
  showCreateTask,
  setShowCreateTask,
}) => {
  const [draggedTask, setDraggedTask] = useState(null);

  const columns = [
    { id: "todo", title: "To Do", icon: "📝" },
    { id: "in-progress", title: "In Progress", icon: "🚀" },
    { id: "done", title: "Done", icon: "✅" },
  ];

  const getTasksByStatus = (status) =>
    tasks.filter((task) => task.status === status);

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  /**
   * =========================
   * FIXED DROP HANDLER ✅
   * =========================
   */
  const handleDrop = async (status) => {
    if (!draggedTask || draggedTask.status === status) {
      setDraggedTask(null);
      return;
    }

    try {
      const res = await taskAPI.updateTask(draggedTask._id, {
        status, // todo | in-progress | done
      });

      onTaskUpdated(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to update task status");
    } finally {
      setDraggedTask(null);
    }
  };

  /**
   * =========================
   * FIXED DELETE HANDLER ✅
   * =========================
   */
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await taskAPI.deleteTask(taskId);
      onTaskDeleted(taskId);
    } catch (err) {
      console.error(err);
      alert("Failed to delete task");
    }
  };

  return (
    <div className="task-board">
      <div className="board-columns">
        {columns.map((column) => (
          <div
            key={column.id}
            className="board-column"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            <div className="column-header">
              <span className="column-icon">{column.icon}</span>
              <h3 className="column-title">{column.title}</h3>
              <span className="column-count">
                {getTasksByStatus(column.id).length}
              </span>
            </div>

            <div className="column-tasks">
              {getTasksByStatus(column.id).length === 0 ? (
                <div className="empty-column">
                  <p>No tasks</p>
                </div>
              ) : (
                getTasksByStatus(column.id).map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    projectId={projectId}
                    onDragStart={() => handleDragStart(task)}
                    onUpdate={onTaskUpdated}
                    onDelete={() => handleDeleteTask(task._id)}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {showCreateTask && (
        <CreateTaskModal
          projectId={projectId}
          onClose={() => setShowCreateTask(false)}
          onTaskCreated={onTaskCreated}
        />
      )}
    </div>
  );
};

export default TaskBoard;