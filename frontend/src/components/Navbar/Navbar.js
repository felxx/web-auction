import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const isAdmin = user?.role === 'ADMIN';

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const items = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: () => navigate('/')
    },
    {
      label: 'Auctions',
      icon: 'pi pi-list',
      items: [
        {
          label: 'Active Auctions',
          icon: 'pi pi-clock',
          command: () => navigate('/auctions/active')
        },
        {
          label: 'My Bids',
          icon: 'pi pi-user',
          command: () => navigate('/my-bids')
        }
      ]
    }
  ];

  if (isAdmin) {
    items.push({
      label: 'Administration',
      icon: 'pi pi-cog',
      items: [
        {
          label: 'Categories',
          icon: 'pi pi-tags',
          command: () => navigate('/admin/categories')
        },
        {
          label: 'Auctions',
          icon: 'pi pi-list',
          command: () => navigate('/admin/auctions')
        }
      ]
    });
  }

  const start = (
    <div className="navbar-brand">
      <i className="pi pi-shopping-cart navbar-brand-icon"></i>
      <span className="navbar-brand-text">Web Auction</span>
    </div>
  );

  const end = (
    <div className="navbar-user-section">
      <div className="navbar-user-info">
        <Avatar 
          icon="pi pi-user" 
          size="normal" 
          className="navbar-user-avatar"
          shape="circle" 
        />
        <span className="navbar-username">{user?.username || 'User'}</span>
      </div>
      <Button 
        icon="pi pi-sign-out" 
        label="Logout"
        className="p-button-outlined p-button-danger navbar-logout-button"
        onClick={handleLogout}
        size="small"
      />
    </div>
  );

  return (
    <Menubar 
      model={items} 
      start={start} 
      end={end} 
      className="navbar-container border-none"
    />
  );
};

export default Navbar;
