import './spinner.scss'

const Spinner = ({ loadingMessage } : { loadingMessage: string }) => {
  return (
    <div className="spinner-container">
        <div className='spinner'></div>
        <h3>
            {loadingMessage}
        </h3>
    </div>
  )
}

export default Spinner