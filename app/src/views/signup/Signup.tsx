import { useRef, useState } from 'react';
import Card from '../../components/card/Card';
import { IUserSignup, TAPIResponse } from '../../context/types';
import './signup.scss';

const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const signUpAction = async (payload: IUserSignup) => {
    try {
        const response = await fetch('/api/signup', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(payload)
            }
        )
        if (response.ok) {
            const APIResponse: TAPIResponse = {
                success: true,
                message: 'Account created.'
            }
            return APIResponse;
        }
        else {
            throw 'Something went wrong...'
        }
    } catch (error) {
        const APIResponse: TAPIResponse = {
            success: false,
            message: error as unknown as string
        }
        return APIResponse;
    }
}

type TFieldError = {
    field: string;
    error: string;
}

const Signup = () => {
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmationRef = useRef<HTMLInputElement>(null);

    const [errors, setFormErrors] = useState<TFieldError[]>([])

    const handleSignup = async () => {
        const name = nameRef?.current?.value;
        const email = emailRef?.current?.value;
        const password = passwordRef?.current?.value;
        const passwordConfirmation = passwordConfirmationRef?.current?.value;

        const errors = [];

        if (!name) errors.push({ field: 'name', error: 'required' });
        if (!email) errors.push({ field: 'email', error: 'required' });

        if (!emailRegexp.test(email as string)) errors.push({ field: 'email', error: 'invalid email' });

        if (!password) errors.push({ field: 'password', error: 'required' });
        if (!passwordConfirmation) errors.push({ field: 'passwordConfirmation', error: 'required' });

        if (password !== passwordConfirmation) errors.push({ field: 'passwordConfirmation', error: 'mismatch' });

        console.log('errors: ', errors);

        if (errors.length) {
            console.log('handleSignup | errors: ', errors);
            setFormErrors(errors);
            return;
        }

        const payload = { name, email, password, password_confirmation: passwordConfirmation };

        const APIResponse = await signUpAction(payload);

        alert(`Signup: ${APIResponse.message}`);
    }

    const hasError = (field: string) => {
        console.log('hasError | errors: ', errors);
        const fields = errors.map(error => error.field);
        return fields.includes(field) ? 'error' : '';
    }

    const renderError = (field: string) => {
        const targetField = errors.find(error => error.field === field);
        return targetField ? targetField.error : '';
    }

    return (
        <div id="signup">
            <Card>
                <>
                    <header><h2>Signup</h2></header>
                    <div className="content">
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
                    </div>
                    <footer className="actions" >
                        <button className='btn-primary' onClick={handleSignup}>SIGNUP</button>
                        <button className='btn-secondary'>CANCEL</button>
                    </footer>
                </>
            </Card>
        </div>
    )
}

export default Signup