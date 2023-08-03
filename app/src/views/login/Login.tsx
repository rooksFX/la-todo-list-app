import { useRef, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AppContext } from '../../context/State';
import { IUser, TAPIResponse } from '../../context/types';

import Card from '../../components/card/Card';
import Toaster from '../../components/toaster/Toaster';

import { loginAction } from './LoginActions';

import './login.scss';

const Login = () => {
    const navigate = useNavigate();

    const { loginSuccessAction, sessionToken } = useContext(AppContext)

    const [toasterMessage, setToasterMessage] = useState('');
    const [toasterType, setToasterType] = useState('')

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (sessionToken) navigate('/board');
    }, [sessionToken]);
    

    const handleLogin = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;

        if (!email || !password) {
                openToaster('Incomplete form.', 'error')
        }
        else {
            const response: TAPIResponse = await loginAction({ email, password });

            if (response.success && loginSuccessAction) {
                loginSuccessAction(response.data as IUser);
                navigate('/board');
            }
            else {
                openToaster(response.message, 'error')
            }
        }

    }

    const openToaster = (message: string, type: string) => {
                setToasterType(type);
                setToasterMessage(message);
                
                setTimeout(() => {
                    setToasterType('');
                    setToasterMessage('');
                }, 2000);
    }

    return (
        <div id="login">
            <Card>
                <>
                    <header>
                        <h2>Login</h2>
                    </header>
                    <div className="content">
                        <form>
                            <div className="form-row offset-left">
                                <div className="label">Email: </div>
                                <div className="field">
                                    <input type="text" ref={emailRef} />
                                </div>
                            </div>
                            <div className="form-row offset-left">
                                <div className="label">Password: </div>
                                <div className="field">
                                    <input type="password" ref={passwordRef} />
                                </div>
                            </div>
                        </form>
                    </div>
                    <footer className="actions" >
                        <button className='btn-primary' onClick={handleLogin} >LOGIN</button>
                        <button className='btn-secondary' onClick={() => navigate('/register')} >REGISTER</button>
                    </footer>
                </>
            </Card>
            <Toaster message={toasterMessage} type={toasterType} />
        </div>
    )
}

export default Login