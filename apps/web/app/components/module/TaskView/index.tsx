"use client";

import React from "react";
import { useViewModel } from "./viewmodel";
import Input from "../../common/Input";
import TaskItem from "../../common/TaskItem";

const TaskView = () => {
  const { tasks, deleteTask, updateTask, title, setTitle, createTask } =
    useViewModel();
  return (
    <div>
      <div className="flex items-end gap-x-2">
        <Input
          type="text"
          placeholder="Task title"
          label="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="btn mb-2"
          disabled={!title}
          onClick={() => createTask({ title })}
        >
          Add
        </button>
      </div>
      <div className="flex flex-col gap-y-2 py-12">
        <h1 className="text-4xl text-white">Tasks</h1>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={deleteTask}
            onUpdate={updateTask}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskView;
