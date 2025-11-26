import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { confirmDialog } from 'primereact/confirmdialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import authService from '../../services/auth/authService';
import './Layout.css';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useRef(null);
    const userMenu = useRef(null);
    const [user] = useState(() => authService.getCurrentUser());

    // Debug: log user info
    React.useEffect(() => {
        console.log('Current user:', user);
        console.log('User role:', user?.role);
        console.log('User roles:', user?.roles);
    }, [user]);

    // Helper function to check user role
    const hasRole = (roleToCheck) => {
        if (!user) return false;
        
        // Check in role field
        if (user.role) {
            const role = user.role.replace('ROLE_', '');
            if (role === roleToCheck) return true;
        }
        
        // Check in roles array
        if (user.roles && Array.isArray(user.roles)) {
            return user.roles.some(r => {
                const role = r.replace('ROLE_', '');
                return role === roleToCheck;
            });
        }
        
        return false;
    };

    const handleLogout = () => {
        confirmDialog({
            message: 'Are you sure you want to logout?',
            header: 'Logout',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                authService.logout();
                toast.current.show({
                    severity: 'success',
                    summary: 'Logout successful',
                    detail: 'You have been successfully logged out',
                    life: 3000
                });
                navigate('/login');
            }
        });
    };

    const userMenuItems = [
        {
            label: 'Profile',
            icon: 'pi pi-user',
            command: () => navigate('/profile')
        },
        {
            label: 'Change Password',
            icon: 'pi pi-key',
            command: () => navigate('/change-password')
        },
        {
            separator: true
        },
        {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: handleLogout
        }
    ];

    const menuItems = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command: () => navigate('/'),
            className: location.pathname === '/' ? 'p-menuitem-active' : ''
        }
    ];

    // Menu items for all authenticated users
    if (user) {
        const auctionSubItems = [
            {
                label: 'All Auctions',
                icon: 'pi pi-list',
                command: () => navigate('/auctions')
            }
        ];

        // Add buyer-specific items
        if (hasRole('BUYER') || hasRole('ADMIN')) {
            auctionSubItems.push(
                {
                    label: 'My Bids',
                    icon: 'pi pi-heart',
                    command: () => navigate('/my-bids')
                },
                {
                    label: 'Won Auctions',
                    icon: 'pi pi-trophy',
                    command: () => navigate('/won-auctions')
                }
            );
        }

        menuItems.push({
            label: 'Auctions',
            icon: 'pi pi-shopping-cart',
            items: auctionSubItems
        });

        // Seller menu
        if (hasRole('SELLER') || hasRole('ADMIN')) {
            menuItems.push({
                label: 'Seller',
                icon: 'pi pi-briefcase',
                items: [
                    {
                        label: 'My Auctions',
                        icon: 'pi pi-shopping-cart',
                        command: () => navigate('/my-auctions')
                    },
                    {
                        label: 'Create Auction',
                        icon: 'pi pi-plus',
                        command: () => navigate('/auctions/new')
                    }
                ]
            });
        }

        // Admin menu
        if (hasRole('ADMIN')) {
            menuItems.push({
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
                        icon: 'pi pi-shopping-cart',
                        command: () => navigate('/admin/auctions')
                    },
                    {
                        label: 'Users',
                        icon: 'pi pi-users',
                        command: () => navigate('/admin/users')
                    },
                    {
                        label: 'Reports',
                        icon: 'pi pi-chart-bar',
                        command: () => navigate('/admin/reports')
                    }
                ]
            });
        }
    } else {
        // Menu for unauthenticated users
        menuItems.push({
            label: 'Auctions',
            icon: 'pi pi-shopping-cart',
            command: () => navigate('/auctions')
        });
    }

    const start = (
        <div className="flex align-items-center">
            <i className="pi pi-shopping-cart text-2xl mr-2 text-primary"></i>
            <span className="text-2xl font-bold text-primary">Web Auction</span>
        </div>
    );

    const end = (
        <div className="flex align-items-center gap-2">
            <Avatar 
                icon="pi pi-user" 
                className="cursor-pointer"
                onClick={(e) => userMenu.current.toggle(e)}
                style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
            />
            <Menu 
                model={userMenuItems} 
                popup 
                ref={userMenu} 
                id="user_menu" 
                popupAlignment="right"
            />
        </div>
    );

    return (
        <div className="layout-wrapper">
            <Toast ref={toast} />
            <ConfirmDialog />
            
            <div className="layout-topbar">
                <Menubar 
                    model={menuItems} 
                    start={start} 
                    end={end}
                    className="border-none"
                />
            </div>
            
            <div className="layout-main">
                <div className="layout-content">
                    {children}
                </div>
            </div>
            
            <div className="layout-footer">
                <div className="footer-content">
                    <div className="flex justify-content-between align-items-center">
                        <div className="text-sm text-600">
                            © 2025 Web Auction. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
