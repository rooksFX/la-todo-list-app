import { CaretUpFilled, CaretDownFilled, EditFilled, DeleteFilled } from '@ant-design/icons';

import { ITask } from '../../../context/types';

import Card from '../../../components/card/Card';

import './task.scss';

interface ITaskProps {
    data: ITask;
    editTask: () => void;
    deleteTask: () => void;
    updateTaskStatus: (data: ITask, newStatus: string) => void;
    reorderTask: (up: boolean) => void;
}

const Task = ({ data, editTask, deleteTask, updateTaskStatus, reorderTask }: ITaskProps) => {

    const handleChangeStatus = (newStatus: string) => () => {
        updateTaskStatus(data, newStatus);
    }

    const renderChangeStatusButtons = () => {
        const status = data.status;
        return (
            <>
                {status !== 'todo' && <button className='btn-link btn-status btn-stop' onClick={handleChangeStatus('todo')} >STOP</button>}
                {status !== 'wip' && <button className='btn-link btn-status btn-start' onClick={handleChangeStatus('wip')} >START</button>}
                {status !== 'done' && <button className='btn-link btn-status btn-done' onClick={handleChangeStatus('done')} >DONE</button>}
            </>
        )
    }

    return (
        <div className="task-slot" draggable>
            <Card>
                <>  
                    <div className="reorder-task-slot">
                        <div className='reorder-btn' onClick={() => reorderTask(true)}><CaretUpFilled /></div>
                        <div className='reorder-btn' onClick={() => reorderTask(false)}><CaretDownFilled /></div>
                    </div>
                    <div className="task">
                        <header className='actions'>
                            <button className='btn-primary btn-icon' onClick={editTask}><EditFilled /></button>
                            <button className='btn-error btn-icon' onClick={deleteTask}><DeleteFilled /></button>
                        </header>
                        <div className="task-detail"><h3>{data.order}: {data.task}</h3></div>
                        <footer className='actions status-actions'>
                            {renderChangeStatusButtons()}
                        </footer>
                    </div>
                </>
            </Card>
        </div>
    )
}

export default Task