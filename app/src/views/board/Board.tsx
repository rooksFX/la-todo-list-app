import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LogoutOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';

import { AppContext } from '../../context/State';
import { ITask, TAPIResponse } from '../../context/types';

import Card from '../../components/card/Card';
import Toaster from '../../components/toaster/Toaster';
import Spinner from '../../components/spinner/Spinner';

import { deleteTaskAction, getTasksAction, patchTaskAction, reorderTasksAction } from './TaskActions';
import Task from './task/Task';
import Upsert from './upsert/Upsert';
import './board.scss';

const COLUMNS = [
  {
    status: 'todo',
    title: 'To Do',
  },
  {
    status: 'wip',
    title: 'In Progress',
  },
  {
    status: 'done',
    title: 'Done',
  },
];

const Board = () => {
    const navigate = useNavigate();
    const { sessionToken,  updateTasksAction, user } = useContext(AppContext)

    const [isLoading, setIsLoading] = useState(false);
    const [taskUpdating, setTaskUpdating] = useState(false);
    const [isUpsertOpen, setIsUpsertOpen] = useState(false);
    const [taskToUpdate, setTaskToUpdate] = useState<ITask | null>(null);

    const [toasterMessage, setToasterMessage] = useState('');
    const [toasterType, setToasterType] = useState('')

    const [allTasks, setAllTasks] = useState<ITask[]>([]);
    const [todoTasks, setTodoTasks] = useState<ITask[]>([]);
    const [wipTasks, setWipTasks] = useState<ITask[]>([]);
    const [doneTasks, setDoneTasks] = useState<ITask[]>([]);

    useEffect(() => {
      const session_token = localStorage.getItem('session_token');
      if (!session_token) {
        navigate('/login');
      }
      else {
        fetchTasks();
      }
    }, []);

    const fetchTasks = async () => {
      setIsLoading(true);
      const email = localStorage.getItem('email');
      const response = await getTasksAction(email as string, user.session);
      if (response.success) {
        if (updateTasksAction) updateTasksAction(response?.data as unknown as ITask[]);
        const tasksData = response.data as ITask[];
        tasksData.sort((a, b) => (a.order as unknown as number) - (b.order as unknown as number));

        setAllTasks(tasksData);
        if (tasksData) distributeTasks(tasksData);
      }
      else {
        if (response.message === 'jwt expired') {
          navigate('/logout');
        }
      }
      setIsLoading(false);
    };

    const upsertTasks = (upsertedTask: ITask) => {
      const column = upsertedTask.status;

      switch (column) {
        case 'todo':
          const newTodoTasks = updateColumns(upsertedTask, todoTasks);
          setTodoTasks(newTodoTasks);
        break;
        case 'wip':
          const newWipTasks = updateColumns(upsertedTask, todoTasks);
          setWipTasks(newWipTasks);
        break;
        default:
          const newDoneTasks = updateColumns(upsertedTask, todoTasks);
          setDoneTasks(newDoneTasks);
        break;
      }
    }

    const closeModal = () => {
      setTaskToUpdate(null);
      setIsUpsertOpen(false);
    }

    const updateColumns = (upsertedTask: ITask, tasksToUpdate: ITask[]) => {
          const newTasksToUpdate = [...tasksToUpdate];
          const index = newTasksToUpdate.findIndex(task => task._id === upsertedTask._id);
          if (index === -1) {
            newTasksToUpdate.push(upsertedTask);
          }
          else {
            newTasksToUpdate[index] = upsertedTask;
          }

          newTasksToUpdate.sort((a, b) => (a.order as unknown as number) - (b.order as unknown as number));
          return newTasksToUpdate;
    }

    const distributeTasks = (tasksData: ITask[]) => {
          const todo = tasksData.filter((task: ITask) => task.status === 'todo');
          const wip = tasksData.filter((task: ITask) => task.status === 'wip');
          const done = tasksData.filter((task: ITask) => task.status === 'done');
        
          setTodoTasks(todo);
          setWipTasks(wip);
          setDoneTasks(done);
    }

    const openToaster = (response: TAPIResponse) => {
        if (response.success) {
          setToasterType('success');
        }
        else {
          setToasterType('error');
        }
        setToasterMessage(response.message);
        
        setTimeout(() => {
          setToasterType('');
          setToasterMessage('');
          if (response.message === 'jwt expired') navigate('logout');
        }, 2000);
    }

    const handleLogout = () => {
      navigate('/logout');
    }

    const handleUpdateTask = (task: ITask) => {
      setTaskToUpdate(task);
      setIsUpsertOpen(true);
    }

    const handleDeleteTask = async (taskToRemove: ITask) => {
      setTaskUpdating(true);
      const response = await deleteTaskAction(taskToRemove, user.session);
      if (response.success) {
        // Remove task from master list
        const newTasks = allTasks.filter(task => task._id !== taskToRemove._id);
        setAllTasks(newTasks);
        distributeTasks(newTasks);
      }
      setTaskUpdating(false);
      openToaster(response);
    }

    const handleUpdateTaskStatus = async (task: ITask, newStatus: string) => {
      setTaskUpdating(true);
      const response = await patchTaskAction(task._id as string, 'status', newStatus, user.session);

      if (response.success) {
        switch (task.status) {
          case 'todo':
            const newTodoTasks = todoTasks.filter(todoTask => todoTask._id !== task._id);
            newTodoTasks.sort((a, b) => (a.order as unknown as number) - (b.order as unknown as number));
            setTodoTasks(newTodoTasks);
            break;
          case 'wip':
            const newWipTasks = wipTasks.filter(todoTask => todoTask._id !== task._id);
            newWipTasks.sort((a, b) => (a.order as unknown as number) - (b.order as unknown as number));
            setWipTasks(newWipTasks);
            break;
          default:
            const newDoneTasks = doneTasks.filter(todoTask => todoTask._id !== task._id);
            newDoneTasks.sort((a, b) => (a.order as unknown as number) - (b.order as unknown as number));
            setDoneTasks(newDoneTasks);
            break;
        }

        const newTask: ITask = {...task};
        newTask.status = newStatus;

        switch (newStatus) {
          case 'todo':
            const newTodoTasks = [...todoTasks, newTask];
            newTodoTasks.sort((a, b) => (a.order as unknown as number) - (b.order as unknown as number));
            setTodoTasks(newTodoTasks);
            break;
          case 'wip':
            const newWipTasks = [...wipTasks, newTask];
            newWipTasks.sort((a, b) => (a.order as unknown as number) - (b.order as unknown as number));
            setWipTasks(newWipTasks);
            break;
          default:
            const newDoneTasks = [...doneTasks, newTask];
            newDoneTasks.sort((a, b) => (a.order as unknown as number) - (b.order as unknown as number));
            setDoneTasks(newDoneTasks);
            break;
        }
      }
      setTaskUpdating(false);
      openToaster(response);
    }

    const handleReorderTask = async (task: ITask, up: boolean) => {
      const column = task.status;

      switch (column) {
        case 'todo':
          const newTodoTasks = await reorderTask(task, todoTasks, up);
          if (!newTodoTasks.length) return;
          setTodoTasks(newTodoTasks);
          break;
        case 'wip':
          const newWipTasks = await reorderTask(task, wipTasks, up);
          if (!newWipTasks.length) return;
          setWipTasks(newWipTasks);
          break;
        default:
          const newDoneTasks = await reorderTask(task, doneTasks, up);
          if (!newDoneTasks.length) return;
          setDoneTasks(newDoneTasks);
          break;
      }
      setTaskUpdating(false);
    }

    const reorderTask = async (task: ITask, tasksToUpdate: ITask[], up: boolean,) => {
          const newTasksToUpdate = [...tasksToUpdate];
          const index = newTasksToUpdate.findIndex(findTask => findTask._id === task._id);

          const indexOfSwapped = up? index - 1 : index + 1;
          if ([-1, tasksToUpdate.length].includes(indexOfSwapped)) return [];
          const taskToReplace = newTasksToUpdate[indexOfSwapped];
          delete newTasksToUpdate[indexOfSwapped];
          delete newTasksToUpdate[index];
          const task_order = task.order;
          const taskToReplace_order = taskToReplace.order;

          // Call API action
          setTaskUpdating(true);
          const APIResponse = await reorderTasksAction(
            task._id as string,
            taskToReplace_order as number, 
            taskToReplace._id as string, 
            task_order as number, 
            sessionToken
          )

          if (APIResponse.success) {
            task.order = taskToReplace_order;
            taskToReplace.order = task_order;
            newTasksToUpdate[indexOfSwapped] = task;
            newTasksToUpdate[index] = taskToReplace;
            newTasksToUpdate.sort((a, b) => (a.order as unknown as number) - (b.order as unknown as number));
            return newTasksToUpdate;
          }
          else {
            if (APIResponse.message === 'jwt expired') {
              navigate('/logout');
            }
          }
          return [];
    }

    const renderTasks = (columnStatus: string) => {
      let tasks = columnStatus === 'todo' ? todoTasks : columnStatus === 'wip' ? wipTasks : doneTasks;
      let tasksEl = [];
      for (const task of tasks) {
        const taskEl = (
          <Task 
            key={crypto.randomUUID()}
            editTask={() => handleUpdateTask(task)}
            deleteTask={() => handleDeleteTask(task)}
            updateTaskStatus={handleUpdateTaskStatus}
            reorderTask={(up: boolean) => handleReorderTask(task, up)}
            data={task} 
          />
        )
        tasksEl.push(taskEl);
      }
      return tasksEl;
    }
    
    const renderTasksCount = (columnStatus: string) => {
      let tasks = columnStatus === 'todo' ? todoTasks : columnStatus === 'wip' ? wipTasks : doneTasks;
      return tasks.length || '-';
    }

    if (isLoading) {
      return (
        <Spinner loadingMessage='Fetching tasks...' />
      );
    }

    return (
      <div id='board'>
        {isUpsertOpen && <Upsert task={taskToUpdate} upsertTasks={upsertTasks} close={closeModal} notify={openToaster} />}
        <header id='board-header'>
          <h2><UnorderedListOutlined /> TASKS</h2>
          <div className='user'>
            <h3>User: {user.name}</h3>
            <button className='logout btn-error' onClick={handleLogout}><LogoutOutlined /> LOGOUT</button>
          </div>
        </header>
        <div id='board-grid'>
            {COLUMNS.map(column => (
              <div key={crypto.randomUUID()} className={`column ${column.status}`}>
                    <h4>{column.title} {renderTasksCount(column.status)}</h4>
                    <>
                        {renderTasks(column.status)}
                    </>
                    {column.status === 'todo' && (<button className='add-task btn-primary' onClick={() => setIsUpsertOpen(true)}><PlusOutlined /> ADD TASK</button>)}
              </div>
            ))}
          </div>
        <Toaster message={toasterMessage} type={toasterType} />
        {taskUpdating && (
          <div id="spinner-slot">
            <Card>
              <Spinner loadingMessage='Updating board...' />
            </Card>
          </div>
        )}
      </div>
    )
}

export default Board