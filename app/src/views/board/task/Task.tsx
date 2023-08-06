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
    disabled: boolean;
}

const Task = ({ data, editTask, deleteTask, updateTaskStatus, reorderTask, disabled }: ITaskProps) => {

    const handleChangeStatus = (newStatus: string) => () => {
        updateTaskStatus(data, newStatus);
    }

    const renderChangeStatusButtons = () => {
        const status = data.status;
        return (
            <>
                {status !== 'todo' && <button className='btn-link btn-status btn-stop' onClick={handleChangeStatus('todo')} disabled={disabled} >STOP</button>}
                {status !== 'wip' && <button className='btn-link btn-status btn-start' onClick={handleChangeStatus('wip')} disabled={disabled} >START</button>}
                {status !== 'done' && <button className='btn-link btn-status btn-done' onClick={handleChangeStatus('done')} disabled={disabled} >DONE</button>}
            </>
        )
    }

    return (
        <div className="task-slot" draggable>
            <Card>
                <>
                    <div className="task">
                        <header className='actions'>
                            <button className='btn-primary btn-icon' onClick={editTask} disabled={disabled}><EditFilled /></button>
                            <button className='btn-error btn-icon' onClick={deleteTask} disabled={disabled}><DeleteFilled /></button>
                        </header>
                        <div className="task-detail"><h3>{data.task}</h3></div>
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