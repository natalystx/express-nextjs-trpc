import { useState } from "react";
import { trpc } from "../../../_trpc/client";

type Task = {
  id: string;
  title: string;
  done: boolean;
};

export const useViewModel = () => {
  const [title, setTitle] = useState("");
  const tasksQuery = trpc.getTasks.useQuery();

  const updateTaskMut = trpc.updateTask.useMutation({
    onSuccess: () => {
      tasksQuery.refetch();
    },
  });

  const deleteTaskMut = trpc.deleteTask.useMutation({
    onSuccess: () => {
      tasksQuery.refetch();
    },
  });

  const createTaskMut = trpc.createTask.useMutation({
    onSuccess: () => {
      tasksQuery.refetch();
    },
  });

  const updateTask = async ({ id, title, done }: Task) => {
    const description = "";
    await updateTaskMut.mutateAsync({ id, title, description, done });
  };

  const deleteTask = async (id: string) => {
    await deleteTaskMut.mutateAsync({ id });
  };

  const createTask = async ({ title }: { title: string }) => {
    const description = "";
    await createTaskMut.mutateAsync({ title, description });
  };

  return {
    tasks: (tasksQuery.data || []) as Task[],
    loading: tasksQuery.isFetching,
    updateTask,
    deleteTask,
    createTask,
    title,
    setTitle,
  };
};
