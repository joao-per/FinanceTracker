import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.tsx';
import { fetchIncomeData } from '../services/api.ts';
import IncomeChartComponent from './IncomeChartComponent.tsx';
import Skeleton from 'react-loading-skeleton';
import '../styles/Income.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTranslation } from 'react-i18next';

interface Investment {
  type: string;
  amount: number;
}

interface IncomeData {
  salary: { amount: number; currency: string };
  investments: Investment[];
  others: { amount: number; currency: string };
  totalIncome: number;
}

const Income: React.FC = () => {
  const { token } = useAuth();
  const { t } = useTranslation();
  const [incomeData, setIncomeData] = useState<IncomeData[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchIncomeData();
        setIncomeData(data.income);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [token]);

  const aggregateData = (data: IncomeData[] | null) => {
    if (!data) return null;

    return data.reduce(
      (acc, monthData) => {
        acc.totalSalary += monthData.salary.amount;
        acc.totalInvestments += monthData.investments.reduce((sum, inv) => sum + inv.amount, 0);
        acc.totalOthers += monthData.others.amount;
        acc.totalIncome += monthData.totalIncome;
        return acc;
      },
      { totalSalary: 0, totalInvestments: 0, totalOthers: 0, totalIncome: 0 }
    );
  };

  const aggregatedData = aggregateData(incomeData);

  return (
    <div className="dashboard-container animate-page">
      <h1>{t('financial_overview')}</h1>

      <div className="income-cards">
        {incomeData === null ? (
          Array(3).fill(null).map((_, index) => (
            <div key={index} className="income-card">
              <Skeleton width="60%" height={24} style={{ marginBottom: '12px' }} />
              <Skeleton width="40%" height={32} />
            </div>
          ))
        ) : (
          <>
            <div className="income-card salary">
              <h3>{t('salary')}</h3>
              <p>€{aggregatedData?.totalSalary.toLocaleString()}</p>
            </div>

            <div className="income-card investments">
              <h3>{t('investments')}</h3>
              {incomeData[0].investments.length === 0 ? (
                <p>{t('no_investments')}</p>
              ) : (
                incomeData[0].investments.map((investment, index) => (
                  <div key={index}>
                    <p><strong>{investment.type}</strong>: €{investment.amount.toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>

            <div className="income-card others">
              <h3>{t('others')}</h3>
              <p>€{aggregatedData?.totalOthers.toLocaleString()}</p>
            </div>
          </>
        )}
      </div>

      <div className="chart-section">
        <h2>{t('financial_health')}</h2>
        {incomeData === null ? (
          <Skeleton height={400} /> 
        ) : (
          <IncomeChartComponent data={incomeData} />
        )}
      </div>
    </div>
  );
};

export default Income;