import { Link } from 'react-router-dom';
import Card from '../../components/card/Card';
import './login.scss';
import { useRef, useContext } from 'react';
import { AppContext } from '../../context/State';

const Login = () => {
    const { signinAction, sessionToken } = useContext(AppContext)

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleLogin = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;

        if (!email || !password) {
            alert('Incomplete form')
        }
        else {
            if (signinAction)  {
                const response = await signinAction({
                    email, password
                })
                console.log('Login | response: ', response);
            }
        }

    }

    return (
        <div id="login">
            <Card>
                <>
                    <header>
                        <h2>Login</h2>
                        <h4><Link to="/signup">Signup</Link></h4>
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
                        <button className='btn-primary' onClick={handleLogin}>LOGIN</button>
                        <button className='btn-secondary'>CANCEL</button>
                    </footer>
                </>
            </Card>
        </div>
    )
}

export default Login