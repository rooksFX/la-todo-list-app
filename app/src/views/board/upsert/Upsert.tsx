import { useContext, useRef } from 'react';
import './upsert.scss';
import { ITask, TAPIResponse } from '../../../context/types';
import { upsertTaskAction } from '../TaskActions';
import Modal from '../../../components/modal/Modal';
import { AppContext } from '../../../context/State';

interface IUpsertProps {
    task: ITask | null
    close: () => void;
    notify: (response: TAPIResponse) => void;
    upsertTasks: (upsertedTask: ITask) => void;
}

const Upsert = ({ task, close, notify, upsertTasks }: IUpsertProps) => {
    const { user } = useContext(AppContext);

    const taskRef = useRef<HTMLInputElement>(null);

    const handleUpdate = async () => {
        const taskValue = taskRef?.current?.value || '';
        const email = localStorage.getItem('email') || '';

        const upsertedTask: ITask = {
            ...(task && { _id: task._id }),
            ...(task && { order: task?.order }), 
            task: taskValue,
            status: task?.status || 'todo',
            email,
        }

        const response = await upsertTaskAction(upsertedTask, user.session);
        console.log('handleUpdate | response: ', response);
        if (response.success) {
            upsertTasks(response.data as unknown as ITask);
            close();
        }

        notify(response);
    }

    return (
        <Modal>
            <>
                <div id="upsert">
                    <header><h2>{task? 'Update Task' : 'Add Task'}</h2></header>
                    <form>
                        <div className="form-row inline">
                            <div className="label">Task: </div>
                            <div className="field">
                                <input type="text" ref={taskRef} placeholder={task?.task || ''} />
                                <div className="error-message">
                                    {/* {renderError('name')} */}
                                </div>
                            </div>
                        </div>
                    </form>
                    <footer className="actions" >
                        <button className='btn-primary' onClick={handleUpdate}>{task? 'UPDATE' : 'ADD'}</button>
                        <button className='btn-secondary' onClick={close}>CANCEL</button>
                    </footer>
                </div>
            </>
        </Modal>
    )
}

export default Upsert