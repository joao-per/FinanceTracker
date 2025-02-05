// src/components/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../hooks/useAuth.tsx';
import { fetchDashboardData } from '../services/api.ts';
import ChartComponent from './ChartComponent.tsx';
import Skeleton from 'react-loading-skeleton';
import '../styles/Dashboard.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTranslation } from 'react-i18next';

interface Metric {
  label: string;
  value: number;
  path: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate(); 
  const { token } = useAuth();
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  const handleMetricClick = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDashboardData(token);
        setMetrics(data.metrics);
        setChartData(data.chartData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [token]);

  return (
    <div className="dashboard-container animate-page">
      <h1>{t('dashboard')}</h1>
      <div className="metrics">
        {metrics.length === 0 ? (
          Array(3).fill(null).map((_, index) => (
            <div key={index} className="metric-card">
              <Skeleton 
                width="60%" 
                height={24} 
                style={{ marginBottom: '12px' }} 
              />
              <Skeleton 
                width="40%" 
                height={32} 
              />
            </div>
          ))
        ) : (
          metrics.map((metric) => (
            <div key={metric.label} className="metric-card clickable" onClick={() => handleMetricClick(metric.path)}>
              <h3>{metric.label}</h3>
              <p>{metric.value}</p>
            </div>
          ))
        )}
      </div>

      <div className="chart-section">
        <h2>{t('upload_invoices')}</h2>
      
          <ChartComponent data={chartData} />
       
      </div>
    </div>
  );
};

export default Dashboard;