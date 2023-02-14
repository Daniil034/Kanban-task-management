import { useEffect } from 'react';
import '../UI/overlay.scss';

const Overlay = ({children, action}) => {

  useEffect(() => {
    const body = document.querySelector('body');
    body.classList.add('noscroll');
    return () => body.classList.remove('noscroll');
  })


  return (
    <div className='overlay' onClick={() => action()}>{children}</div>
  )
}

export default Overlay