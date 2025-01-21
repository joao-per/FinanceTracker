// src/components/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.tsx';
import { fetchDashboardData } from '../services/api.ts';
import ChartComponent from './ChartComponent.tsx';
import '../styles/Dashboard.css';
import { useTranslation } from 'react-i18next';


interface Metric {
  label: string;
  value: number;
}

const Dashboard: React.FC = () => {
  const { token } = useAuth();
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

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
        {metrics.map((metric) => (
          <div key={metric.label} className="metric-card">
            <h3>{metric.label}</h3>
            <p>{metric.value}</p>
          </div>
        ))}
      </div>
      <div className="chart-section">
        <h2>{t('upload_invoices')}</h2>
        <ChartComponent data={chartData} />
      </div>
    </div>
  );
};

export default Dashboard;