export const fetchDashboardData = async (token: string | null) => {
  // Simulação de chamada à API para métricas e dados do gráfico.
  return new Promise<{
    metrics: { label: string; value: number, path: string }[];
    chartData: any[];
  }>((resolve) => {
    setTimeout(() => {
      resolve({
        metrics: [
          { label: 'Rendimentos', value: 5000, path: '/income' },
          { label: 'Despesas', value: 3000, path: '/expenses' },
          { label: 'Dívidas', value: 1500, path: '/debt' }
        ],
        chartData: [
          { name: 'Jan', uv: 4000 },
          { name: 'Fev', uv: 3000 },
          { name: 'Mar', uv: 2000 },
          { name: 'Abr', uv: 2780 },
          { name: 'Mai', uv: 1890 },
          { name: 'Jun', uv: 2390 },
          { name: 'Jul', uv: 3490 }
        ]
      });
    }, 1000);
  });
};

export const fetchIncomeData = async () => {
  return new Promise<{
    income: {
      salary: { amount: number; currency: string };
      investments: { type: string; amount: number }[];
      others: { amount: number; currency: string };
      totalIncome: number;
    }[];
  }>((resolve) => {
    setTimeout(() => {
      resolve({
        income: [
          {
            salary: { amount: 5000, currency: 'EUR' },
            investments: [
              { type: 'Stocks', amount: 2000 },
              { type: 'Bonds', amount: 1000 },
            ],
            others: { amount: 1000, currency: 'EUR' },
            totalIncome: 5000 + 2000 + 1000 + 1000,
          },
          {
            salary: { amount: 5200, currency: 'EUR' },
            investments: [
              { type: 'Stocks', amount: 2100 },
              { type: 'Bonds', amount: 1100 },
            ],
            others: { amount: 1200, currency: 'EUR' },
            totalIncome: 5200 + 2100 + 1100 + 1200,
          },
          {
            salary: { amount: 5300, currency: 'EUR' },
            investments: [
              { type: 'Stocks', amount: 2200 },
              { type: 'Bonds', amount: 1200 },
            ],
            others: { amount: 1300, currency: 'EUR' },
            totalIncome: 5300 + 2200 + 1200 + 1300,
          },
          {
            salary: { amount: 5400, currency: 'EUR' },
            investments: [
              { type: 'Stocks', amount: 2300 },
              { type: 'Bonds', amount: 1300 },
            ],
            others: { amount: 1400, currency: 'EUR' },
            totalIncome: 5400 + 2300 + 1300 + 1400,
          },
          {
            salary: { amount: 5500, currency: 'EUR' },
            investments: [
              { type: 'Stocks', amount: 2400 },
              { type: 'Bonds', amount: 1400 },
            ],
            others: { amount: 1500, currency: 'EUR' },
            totalIncome: 5500 + 2400 + 1400 + 1500,
          },
          {
            salary: { amount: 5600, currency: 'EUR' },
            investments: [
              { type: 'Stocks', amount: 2500 },
              { type: 'Bonds', amount: 1500 },
            ],
            others: { amount: 1600, currency: 'EUR' },
            totalIncome: 5600 + 2500 + 1500 + 1600,
          },
        ],
      });
    }, 1000);
  });
};


