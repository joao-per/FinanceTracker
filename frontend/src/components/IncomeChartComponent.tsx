import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { useTranslation } from 'react-i18next';

const IncomeChartComponent = ({ data }) => {
    const { t } = useTranslation();

    if (!data || data.length === 0) {
     return <p>No data available for the chart.</p>;
    }

    const chartData = data.map((monthData, index) => ({
        month: new Date(2025, index).toLocaleString('default', { month: 'long' }), 
        salary: monthData.salary.amount,
        investments: monthData.investments.reduce((sum, inv) => sum + inv.amount, 0),
        others: monthData.others.amount,
        net: monthData.totalIncome,
    }));


    if (chartData.length === 1) {
        chartData.push({ ...chartData[0], month: 'Next Month' }); 
    }

    return (
        <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line
            type="monotone"
            dataKey="salary"
            stroke="#4CAF50"
            strokeWidth={2}
            name={t('salary')}
        />
        <Line
            type="monotone"
            dataKey="investments"
            stroke="#2196F3"
            strokeWidth={2}
            name={t('investments')}
        />
        <Line
            type="monotone"
            dataKey="others"
            stroke="#9C27B0"
            strokeWidth={2}
            name={t('others')}
        />
        <Line
            type="monotone"
            dataKey="net"
            stroke="#FF9800"
            strokeWidth={3}
            name="Net Balance"
            dot={{ fill: '#FF9800', strokeWidth: 2 }}
        />
        </LineChart>
        </ResponsiveContainer>
    );
};

export default IncomeChartComponent;