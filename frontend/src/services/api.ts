export const fetchDashboardData = async (token: string | null) => {
  // Simulação de chamada à API para métricas e dados do gráfico.
  return new Promise<{
    metrics: { label: string; value: number }[];
    chartData: any[];
  }>((resolve) => {
    setTimeout(() => {
      resolve({
        metrics: [
          { label: 'Rendimentos', value: 5000 },
          { label: 'Despesas', value: 3000 },
          { label: 'Dívidas', value: 1500 }
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
