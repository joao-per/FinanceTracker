import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.tsx';
import { fetchDashboardData } from '../services/api.ts';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Button,
  IconButton,
  Tooltip,
  Paper,
  LinearProgress,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme,
} from '@mui/material';
import {
  ArrowForward,
  TrendingUp,
  MonetizationOn,
  Receipt,
  BarChart,
  Notifications,
  Refresh,
} from '@mui/icons-material';
import ChartComponent from './ChartComponent.tsx';

interface Metric {
  label: string;
  value: number;
  path: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleMetricClick = (path: string) => {
    navigate(path);
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const data = await fetchDashboardData(token);
      setMetrics(data.metrics);
      setChartData(data.chartData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDashboardData(token);
        setMetrics(data.metrics);
        setChartData(data.chartData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.background.default }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: theme.palette.text.primary }}>
          {t('dashboard')}
        </Typography>
        <Box>
          <Tooltip title={t('refresh')}>
            <IconButton onClick={handleRefresh} sx={{ color: theme.palette.text.primary }}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('notifications')}>
            <IconButton sx={{ color: theme.palette.text.primary }}>
              <Notifications />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {loading
          ? Array(3).fill(null).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Skeleton width="60%" height={24} style={{ marginBottom: '12px' }} />
                    <Skeleton width="40%" height={32} />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : metrics.map((metric) => (
              <Grid item xs={12} sm={6} md={4} key={metric.label}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: theme.shadows[6],
                    },
                  }}
                  onClick={() => handleMetricClick(metric.path)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
                        {metric.label}
                      </Typography>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        {metric.label === 'Income' ? (
                          <MonetizationOn />
                        ) : metric.label === 'Expenses' ? (
                          <Receipt />
                        ) : (
                          <TrendingUp />
                        )}
                      </Avatar>
                    </Box>
                    <Typography variant="h4" sx={{ mt: 2, color: theme.palette.text.primary }}>
                      {metric.value} €
                    </Typography>
                    <Button
                      endIcon={<ArrowForward />}
                      sx={{ mt: 2, color: theme.palette.primary.main }}
                    >
                      {t('view_details')}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
      </Grid>

      <Paper sx={{ p: 3, mb: 4, backgroundColor: theme.palette.background.paper }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ color: theme.palette.text.primary }}>
            {t('financial_overview')}
          </Typography>
          <Chip label={t('months6later')} color="primary" />
        </Box>
        <Divider sx={{ mb: 3 }} />
        {loading ? (
          <Skeleton variant="rectangular" height={400} />
        ) : (
          <ChartComponent data={chartData} />
        )}
      </Paper>

      <Paper sx={{ p: 3, backgroundColor: theme.palette.background.paper }}>
        <Typography variant="h5" sx={{ color: theme.palette.text.primary, mb: 3 }}>
          {t('recent_activity')}
        </Typography>
        <List>
          {Array(3).fill(null).map((_, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <BarChart />
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={t("new_invoice_uploaded")}
                secondary={t("hours_ago",{hour:2})}
                primaryTypographyProps={{ color: theme.palette.text.primary }}
                secondaryTypographyProps={{ color: theme.palette.text.secondary }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Dashboard;