import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

import logo from '../assets/logoWhite.png';
import shareVideo from '../assets/share.mp4';
import { client } from '../client';

const Login = () => {

  const navigate = useNavigate();

  const handleCallBackResponse = (response) => {
    localStorage.setItem('user', JSON.stringify(response.credential));
    let userObject = jwt_decode(response.credential);

    const { name, picture, sub } = userObject;

    const doc = {
      _id: sub,
      _type: 'user',
      userName: name,
      image: picture,
    }
    
    client.createIfNotExists(doc).then(() => {
      navigate('/', { replace: true })
    })
  }

  useEffect(() => {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_APP_GOOGLE_ID ,
      callback: handleCallBackResponse
    });
  
    google.accounts.id.renderButton(
      document.getElementById('signIn'),
      { theme: 'outline', size: "large" }
    );
  }, []);

  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
        <video src={shareVideo}
        typeof='video/mp4'
        loop
        controls={false}
        muted
        autoPlay
        className='w-full h-full object-cover' />

        <div className='absolute flex flex-col justify-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
          <div className='p-5 flex justify-center'>
            <img src={logo} alt="logo" width='130px' />
          </div>

          <div className='shadow-2x1 flex justify-center '>
            <div id='signIn' ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login