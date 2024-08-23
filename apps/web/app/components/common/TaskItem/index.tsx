"use client";
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Input from "../Input";

type Task = {
  id: string;
  title: string;
  done: boolean;
};

type TaskItemProps = {
  task: Task;
  onDelete: (id: string) => void;
  onUpdate: (task: Task) => void;
};

const TaskItem = ({ task, onDelete, onUpdate }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  return (
    <div className="w-full flex gap-x-4 items-end">
      <Input
        readOnly={!isEditing || task.done}
        label="Title"
        className="w-full"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <div className="flex gap-x-2 mb-2">
        <button
          disabled={task.done}
          onClick={() => {
            setIsEditing(!isEditing);
            if (isEditing) {
              onUpdate({ ...task, title });
            }
          }}
          className="btn btn-primary"
        >
          {isEditing ? "Save" : "Edit"}
        </button>
        <button
          disabled={task.done}
          onClick={() => onUpdate({ ...task, done: !task.done })}
          className="btn btn-danger"
        >
          Mask as done
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="btn btn-danger"
          disabled={task.done}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
