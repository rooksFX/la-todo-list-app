import './toaster.scss';

const Toaster = ({ message, type } : { message: string, type: string }) => {
  return (
    <>
        {message ? (
            <div className={`toaster ${type}`} >{message}</div>
        ) : (
            null
        )
        }
    </>
  )
}

export default Toaster