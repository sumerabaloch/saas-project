import React from 'react';
import './TaskCard.css';

const TaskCard = ({ task, projectId, onDragStart, onUpdate, onDelete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // ✅ SAFE assigned user name
  const assigneeName =
    task?.assignedTo?.name ||
    task?.assignedTo?.email ||
    null;

  return (
    <div
      className="task-card"
      draggable
      onDragStart={onDragStart}
    >
      <div className="task-card-header">
        <h4 className="task-title">{task.title}</h4>
        <button
          onClick={onDelete}
          className="task-delete-btn"
          title="Delete task"
        >
          ×
        </button>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-footer">
        {task.priority && (
          <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        )}

        {task.deadline && (
          <span className="task-deadline">
            📅 {formatDate(task.deadline)}
          </span>
        )}

        {/* ✅ SAFE RENDER */}
        {assigneeName && (
          <div className="task-assignee" title={assigneeName}>
            {assigneeName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;