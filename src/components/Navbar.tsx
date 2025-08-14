'use client';

import { authService } from '@/services/AuthService';
import { UserProfile, userService } from '@/services/UserService';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);

  const getPlaceholderImage = (username?: string) => {
    if (username) {
      const hash = btoa(username.toLowerCase()).slice(0, 32);
      return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=40`;
    }
    return 'https://www.gravatar.com/avatar/?d=mp&s=40';
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userProfile = await userService.getUserProfile();
        setUser(userProfile);

        const pictureUrl = await userService.getProfilePictureUrl();
        setProfilePictureUrl(pictureUrl);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = () => {
    authService.logout();
    redirect('/login');
  };

  const handleHomeClick = () => {
    window.location.href = '/home';
  };

  return (
    <div className='navbar bg-base-200 shadow-sm'>
      <div className='navbar-start'>
        <div className='dropdown'>
          <div
            tabIndex={0}
            role='button'
            className='btn btn-ghost btn-circle'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              {' '}
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 6h16M4 12h16M4 18h7'
              />{' '}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className='menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow'
          >
            <li>
              <a>Nada por aqui no momento</a>
            </li>
          </ul>
        </div>
      </div>
      <div className='navbar-center'>
        <a
          onClick={() => {
            handleHomeClick();
          }}
          className='btn btn-ghost text-3xl'
        >
          PDZ+
        </a>
      </div>
      <div className='navbar-end'>
        <div
          role='button'
          className='dropdown dropdown-start mr-3 flex items-center gap-3 btn p-0'
          tabIndex={0}
        >
          <div className=''>
            <div className='avatar'>
              <div className='w-10 rounded-full'>
                <img
                  alt='Profile picture'
                  src={profilePictureUrl || getPlaceholderImage(user?.username)}
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== getPlaceholderImage(user?.username)) {
                      target.src = getPlaceholderImage(user?.username);
                    }
                  }}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className='menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 p-2 shadow'
            >
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
          {user && (
            <div className='navbar-user'>
              <span className='font-bold'>{user.username}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
