import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { IUserRegister } from '../../context/types';

import Card from '../../components/card/Card';
import Toaster from '../../components/toaster/Toaster';

import { registerAction } from './RegisterActions';

import './register.scss';

const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

type TFieldError = {
    field: string;
    error: string;
}

const validateForm = (body: IUserRegister) => {
    const errors = [];
    const { name, email, password, password_confirmation: passwordConfirmation } = body;

    if (!name) errors.push({ field: 'name', error: 'required' });
    if (!email) errors.push({ field: 'email', error: 'required' });

    if (!emailRegexp.test(email as string)) errors.push({ field: 'email', error: 'invalid email' });

    if (!password) errors.push({ field: 'password', error: 'required' });
    if (!passwordConfirmation) errors.push({ field: 'passwordConfirmation', error: 'required' });

    if (password !== passwordConfirmation) errors.push({ field: 'passwordConfirmation', error: 'mismatch' });

    return errors;
}

const Signup = () => {
    const navigate = useNavigate();

    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmationRef = useRef<HTMLInputElement>(null);

    const [componentKey, setComponentKey] = useState(0);
    const [errors, setFormErrors] = useState<TFieldError[]>([]);
    const [toasterMessage, setToasterMessage] = useState('');
    const [toasterType, setToasterType] = useState('')

    const handleSignup = async () => {
        setFormErrors([]);

        const name = nameRef?.current?.value;
        const email = emailRef?.current?.value;
        const password = passwordRef?.current?.value;
        const passwordConfirmation = passwordConfirmationRef?.current?.value;

        const body = { name, email, password, password_confirmation: passwordConfirmation };

        const errors = validateForm(body as IUserRegister);

        if (errors.length) {
            console.log('handleSignup | errors: ', errors);
            setFormErrors(errors);
            return;
        }

        const APIResponse = await registerAction(body as IUserRegister);

        if (APIResponse.success) {
            setToasterType('success');
            setComponentKey(componentKey + 1);
        }
        else {
            setToasterType('error');
        }
        setToasterMessage(APIResponse.message);
        
        setTimeout(() => {
            setToasterType('');
            setToasterMessage('');
        }, 2000);
    }

    const hasError = (field: string) => {
        const fields = errors.map(error => error.field);
        return fields.includes(field) ? 'error' : '';
    }

    const renderError = (field: string) => {
        const targetField = errors.find(error => error.field === field);
        return targetField ? targetField.error : '';
    }

    return (
        <div id="signup" key={componentKey} >
            <Card>
                <>
                    <header><h2>Signup</h2></header>
                    <div className="content" draggable>
                        <form>
                            <div className="form-row">
                                <div className="label">Name: </div>
                                <div className="field">
                                    <input type="text" className={hasError('name')} ref={nameRef}/>
                                    <div className="error-message">
                                        {renderError('name')}
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="label">Email: </div>
                                <div className="field">
                                    <input type="text" className={hasError('email')} ref={emailRef}/>
                                    <div className="error-message">
                                        {renderError('email')}
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="label">Password: </div>
                                <div className="field">
                                    <input type="password" className={hasError('password')} ref={passwordRef}/>
                                    <div className="error-message">
                                        {renderError('password')}
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="label">Password Confirmation: </div>
                                <div className="field">
                                    <input type="password" className={hasError('passwordConfirmation')} ref={passwordConfirmationRef}/>
                                    <div className="error-message">
                                        {renderError('passwordConfirmation')}
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div className="error-message">
                            {renderError('name')}
                        </div>
                    </div>
                    <footer className="actions" >
                        <button className='btn-primary' onClick={handleSignup}>SIGNUP</button>
                        <button className='btn-secondary' onClick={() => navigate('/login')}>CANCEL</button>
                    </footer>
                </>
            </Card>
             <Toaster message={toasterMessage} type={toasterType} />
        </div>
    )
}

export default Signup