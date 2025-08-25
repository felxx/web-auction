import React from 'react';
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Button } from 'primereact/button';

const AdminPageLayout = ({ 
  title, 
  subtitle, 
  breadcrumbs = [], 
  actionButton, 
  children,
  loading = false 
}) => {
  const defaultBreadcrumbs = [
    { label: 'Home', url: '/' },
    { label: 'Administration' },
    ...breadcrumbs
  ];

  return (
    <div className="admin-layout">
      <BreadCrumb 
        model={defaultBreadcrumbs} 
        className="auction-card admin-layout-breadcrumb"
      />

      <Card className="auction-card admin-layout-header">
        <div className="admin-layout-header-content">
          <div className="admin-layout-title-section">
            <h1 className="admin-layout-title">
              <i className="pi pi-cog admin-layout-title-icon"></i>
              {title}
            </h1>
            {subtitle && (
              <p className="admin-layout-subtitle">{subtitle}</p>
            )}
          </div>
          {actionButton && (
            <div className="admin-layout-actions">
              {actionButton}
            </div>
          )}
        </div>
      </Card>

      <div className="admin-layout-content">
        {children}
      </div>
    </div>
  );
};

export default AdminPageLayout;
