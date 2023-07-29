import './card.scss';

const Card = ({ children }: { children: JSX.Element }) => {
  return (
    <div className='card'>
        { children }
    </div>
  )
}

export default Card