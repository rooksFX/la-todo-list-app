import { MutableRefObject, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LogoutOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import { AppContext } from '../../context/State';
import { ITask, TAPIResponse, TTasksToReorder } from '../../context/types';

import Card from '../../components/card/Card';
import Toaster from '../../components/toaster/Toaster';
import Spinner from '../../components/spinner/Spinner';

import { deleteTaskAction, getTasksAction, patchTaskAction, reorderTasksAction } from './TaskActions';
import Task from './task/Task';
import Upsert from './upsert/Upsert';
import './board.scss';
import { useStateWithDeps } from 'swr/_internal';

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
    const [isReorderingTasks, setIsReorderingTasks] = useState(false)

    const isReordering = useRef(false);
    
    const [backupTodoTasks, setBackupTodoTasks] = useState<ITask[]>([]);
    const [backupWipTasks, setBackupWipTasks] = useState<ITask[]>([]);
    const [backupDoneTasks, setBackupDoneTasks] = useState<ITask[]>([]);

    const backupTodoTasksRef = useRef<ITask[]>([]);
    const backupWipTasksRef = useRef<ITask[]>([]);
    const backupDoneTasksRef = useRef<ITask[]>([]);

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // const prevTodoTasks = useRef<ITask[]>([]);
    // const prevWipTasks = useRef<ITask[]>([]);
    // const prevDoneTasks = useRef<ITask[]>([]);

    // const [isReordering, setIsReordering] = useState(false)

    // console.log('RENDER todoTasks: ', todoTasks);
    // console.log('RENDER wipTasks: ', wipTasks);
    // console.log('RENDER doneTasks: ', doneTasks);

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
        
            const tasksToReorder: TTasksToReorder[] = [
              {
                _id: task._id as string,
                field: 'order',
                value: taskToReplace_order as number
              },
              {
                _id: taskToReplace._id as string,
                field: 'order',
                value: task_order as number
              }
            ]

          const APIResponse = await reorderTasksAction(
            tasksToReorder,
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
      let tasks: ITask[] = columnStatus === 'todo' ? todoTasks : columnStatus === 'wip' ? wipTasks : doneTasks;
      let tasksEl = [];
      for (const [index, task] of tasks.entries()) {
        const taskEl = (
          <Draggable key={task._id} draggableId={index.toString()} index={index} >
            {provided => (
                <div className="task-container"
                  ref={provided.innerRef}
                  {...provided.dragHandleProps}
                  {...provided.draggableProps}
                >
                  <Task 
                    key={task._id}
                    editTask={() => handleUpdateTask(task)}
                    deleteTask={() => handleDeleteTask(task)}
                    updateTaskStatus={handleUpdateTaskStatus}
                    reorderTask={(up: boolean) => handleReorderTask(task, up)}
                    data={task}
                    disabled={isReorderingTasks}
                  />
                </div>

              )
            }
          </Draggable>
        )
        tasksEl.push(taskEl);
      }
      return tasksEl;
    }
    
    const renderTasksCount = (columnStatus: string) => {
      let tasks = columnStatus === 'todo' ? todoTasks : columnStatus === 'wip' ? wipTasks : doneTasks;
      return tasks.length || '-';
    }

    const handleDrop = (droppedItem: DropResult) => {
      console.log('handleDrop | todoTasks');
      console.log('handleDrop | isReordering.current: ', isReordering.current);

      if (!droppedItem.destination) return;
      let column = droppedItem.destination.droppableId;
      let sourceIndex = droppedItem.source.index;
      let destinationIndex = droppedItem.destination.index;
      let columnToUpdate: ITask[] = [];
      let originalColumnData: ITask[] = [];
      let backupColumn: MutableRefObject<ITask[]>;
      let columnSetter = setDoneTasks;
      switch (column) {
        case 'todo':
          columnToUpdate = JSON.parse(JSON.stringify(todoTasks));
          originalColumnData = JSON.parse(JSON.stringify(todoTasks));
          backupColumn = backupTodoTasksRef;
          columnSetter = setTodoTasks;
          break;
        case 'wip':
          columnToUpdate = JSON.parse(JSON.stringify(wipTasks));
          originalColumnData = JSON.parse(JSON.stringify(wipTasks));
          backupColumn = backupWipTasksRef;
          columnSetter = setWipTasks;
          break;
        default:
          columnToUpdate = JSON.parse(JSON.stringify(doneTasks));
          originalColumnData = JSON.parse(JSON.stringify(doneTasks));
          backupColumn = backupDoneTasksRef;
          break;
      }

      if (backupColumn && !backupColumn.current.length) backupColumn.current = originalColumnData;
      
      // Remove dragged item
      const [reorderedItem] = columnToUpdate.splice(sourceIndex, 1);
      // Add dropped item
      columnToUpdate.splice(destinationIndex, 0, reorderedItem);
        
      originalColumnData.forEach((task: ITask, index: number) => {
        if (columnToUpdate[index].order !== task.order) {
          columnToUpdate[index].order = task.order;
        }
      });
      console.log('handleDrop | originalColumnData: ', originalColumnData);
      console.log('handleDrop | columnToUpdate: ', columnToUpdate);

      // Update State
      // setIsReordering(true);

      if (!isReorderingTasks) setIsReorderingTasks(true);
      columnSetter(columnToUpdate);
      isReordering.current = true;
      console.log('timerRef.current: ', timerRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        isReordering.current = false;
        console.log('reorderTasks!');
        reorderTasks(columnToUpdate, backupColumn, columnSetter);
      }, 3000)
    };
  
    const reorderTasks = async (columnToUpdate: ITask[],  backupColumn: MutableRefObject<ITask[]>, columnSetter: (tasks: ITask[]) => void) => {

        console.log('reorderTasks | todoTasks: ', todoTasks);

          const tasksToReorder = columnToUpdate.map(task => {
            return {
              _id: task._id as string,
              field: 'order',
              value: task.order as number
            }
          })

          setTaskUpdating(true);
          const APIResponse = await reorderTasksAction(
            tasksToReorder,
            sessionToken
          )

          if (APIResponse.success) {
            console.log('Tasks reordered!');
            backupColumn.current = [];
          }
          else {
            // Revert to old data
            columnSetter(backupColumn.current);
          }

          setIsReorderingTasks(false);
          setTaskUpdating(false);
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
        <div key={crypto.randomUUID()} id='board-grid'>
            {COLUMNS.map(column => (
              <DragDropContext key={crypto.randomUUID()} onDragEnd={handleDrop}>
                <Droppable droppableId={`${column.status}`} >
                  {(provided) => (
                    <div id={`${column.status}`} className={`column ${column.status}`} ref={provided.innerRef} {...provided.droppableProps}>
                          <h4>{column.title} {renderTasksCount(column.status)}</h4>
                          <>
                              {renderTasks(column.status)}
                              {provided.placeholder}
                          </>
                          {column.status === 'todo' && (<button className='add-task btn-primary' onClick={() => setIsUpsertOpen(true)} disabled={isReorderingTasks} ><PlusOutlined /> ADD TASK</button>)}
                    </div>
                  )}
                </Droppable>
              </DragDropContext> 
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