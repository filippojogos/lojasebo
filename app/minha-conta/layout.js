import React from 'react';
import DashboardSidebar from '../components/DashboardSidebar';

export default function MinhaContaLayout({ children }) {
    return (
        <div className="dashboard-container">
            <DashboardSidebar />
            <main className="dashboard-content">
                {children}
            </main>
        </div>
    );
}
