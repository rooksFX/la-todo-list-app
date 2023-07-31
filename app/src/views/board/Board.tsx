import { useNavigate } from 'react-router-dom';
import './board.scss';
import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../../context/State';
import Card from '../../components/card/Card';
import { deleteTaskAction, getTasksAction, patchTaskAction } from './TaskActions';
import { ITask, TAPIResponse } from '../../context/types';
import Task from './task/Task';
import Upsert from './upsert/Upsert';
import Toaster from '../../components/toaster/Toaster';

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
    const { sessionToken, 
      updateTasksAction, logoutAction } = useContext(AppContext)
  
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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
      const email = localStorage.getItem('email');
      const response = await getTasksAction(email as string);
      if (response.success) {
        if (updateTasksAction) updateTasksAction(response?.data as unknown as ITask[]);
        const tasksData = response.data as ITask[];

        setAllTasks(tasksData);
        if (tasksData) distributeTasks(tasksData);
      }
      else {
        setError(response.message);
      }
    };

    const updateTasks = (upsertedTask: ITask) => {
      const newTasks = [...allTasks]
      const index = allTasks.findIndex(task => task._id === upsertedTask._id)
      if (index === -1) {
        newTasks.push(upsertedTask);
      }
      else {
        newTasks[index] = upsertedTask;
      }
      setAllTasks(newTasks);
      distributeTasks(newTasks);
    }

    const distributeTasks = (tasksData: ITask[]) => {
          const todo = tasksData.filter((task: ITask) => task.status === 'todo');
          const wip = tasksData.filter((task: ITask) => task.status === 'wip');
          const done = tasksData.filter((task: ITask) => task.status === 'done');

          if (todo.length) setTodoTasks(todo);
          if (wip.length) setWipTasks(wip);
          if (done.length) setDoneTasks(done);
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
        }, 2000);
    }

    const handleLogout = () => {
      if (logoutAction) logoutAction();
      navigate('/login');
    }

    const handleAddTask = () => {
      setIsUpsertOpen(true);
    }

    const handleUpdateTask = (task: ITask) => {
      setTaskToUpdate(task);
      setIsUpsertOpen(true);
    }

    const handleDeleteTask = async (taskToRemove: ITask) => {
      const response = await deleteTaskAction(taskToRemove);
        if (response.success) {
          // Remove task from master list
          const newTasks = allTasks.filter(task => task._id !== taskToRemove._id);
          setAllTasks(newTasks);
          distributeTasks(newTasks);
        }
        openToaster(response);
    }

    const closeModal = () => {
      setTaskToUpdate(null);
      setIsUpsertOpen(false);
    }

    const handleUpdateTaskStatus = async (task: ITask, newStatus: string) => {
      const response = await patchTaskAction(task._id as string, 'status', newStatus);

      if (response.success) {
        switch (task.status) {
          case 'todo':
            const newTodoTasks = todoTasks.filter(todoTask => todoTask._id !== task._id);
            setTodoTasks(newTodoTasks);
            break;
          case 'wip':
            const newWipTasks = wipTasks.filter(todoTask => todoTask._id !== task._id);
            console.log('handleUpdateTaskStatus | newWipTasks: ', newWipTasks);
            setWipTasks(newWipTasks);
            break;
          default:
            const newDoneTasks = doneTasks.filter(todoTask => todoTask._id !== task._id);
            setDoneTasks(newDoneTasks);
            break;
        }

        const newTask: ITask = {...task};
        newTask.status = newStatus;

        switch (newStatus) {
          case 'todo':
            const newTodoTasks = [...todoTasks, newTask];
            setTodoTasks(newTodoTasks);
            break;
          case 'wip':
            const newWipTasks = [...wipTasks, newTask];
            setWipTasks(newWipTasks);
            break;
          default:
            const newDoneTasks = [...doneTasks, newTask];
            setDoneTasks(newDoneTasks);
            break;
        }
      }
      openToaster(response);
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
            data={task} 
          />
        )
        tasksEl.push(taskEl);
      }
      return tasksEl
    }

    if (!allTasks.length) {
      return null;
    }

    return (
      <div id="board">
        {isUpsertOpen && <Upsert task={taskToUpdate} updateTasks={updateTasks} close={closeModal} notify={openToaster} />}
        <header>
          <button className='logout btn-error' onClick={handleLogout}>LOGOUT</button>
        </header>
        <Card>
          <>
            <header>Tasks</header>
            <div id="board-grid">
              {COLUMNS.map(column => (
                <div key={crypto.randomUUID()} className={`column ${column.status}`}>
                      <h4>{column.title}</h4>
                      <>
                         {renderTasks(column.status)}
                      </>
                      {column.status === 'todo' && (<button className='add-task btn-primary' onClick={handleAddTask}>+ Add Task</button>)}
                </div>
              ))}
            </div>
          </>
        </Card>
        <Toaster message={toasterMessage} type={toasterType} />
      </div>
    )
}

export default Board