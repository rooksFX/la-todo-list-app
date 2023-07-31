import Card from '../../../components/card/Card';
import { ITask } from '../../../context/types';
import './task.scss';

interface ITaskProps {
    data: ITask;
    editTask: () => void;
    deleteTask: () => void;
    updateTaskStatus: (data: ITask, newStatus: string) => void;
}

const Task = ({ data, editTask, deleteTask, updateTaskStatus }: ITaskProps) => {
    const handleChangeStatus = (newStatus: string) => () => {
        console.log('handleChangeStatus | newStatus: ', newStatus);
        updateTaskStatus(data, newStatus);
    }

    const renderChangeStatusButtons = () => {
        const status = data.status;
        return (
            <>
                {status !== 'todo' && <button className='btn-link' onClick={handleChangeStatus('todo')} >STOP</button>}
                {status !== 'wip' && <button className='btn-link' onClick={handleChangeStatus('wip')} >START</button>}
                {status !== 'done' && <button className='btn-link' onClick={handleChangeStatus('done')} >DONE</button>}
            </>
        )
    }

    return (
        <div className="task" draggable>
            <Card>
                <>  
                    <header className='actions'>
                        <button className='btn-primary' onClick={editTask}>EDIT</button>
                        <button className='btn-error' onClick={deleteTask}>X</button>
                    </header>
                    <div className="task-detail"><h3>{data.order}: {data.task}</h3></div>
                    <footer className='actions status-actions'>
                        {renderChangeStatusButtons()}
                    </footer>
                </>
            </Card>
        </div>
    )
}

export default Task