import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.tsx';
import { fetchIncomeData } from '../services/api.ts';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Skeleton,
  ButtonGroup,
  Button,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Grid,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  useTheme
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import IncomeChartComponent from './IncomeChartComponent.tsx';

interface Investment {
  type: string;
  amount: number;
}

interface IncomeData {
  id: string;
  salary: { amount: number; currency: string };
  investments: Investment[];
  others: { amount: number; currency: string };
  totalIncome: number;
}

const Income: React.FC = () => {
  const { token } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  const rowsPerPage = 5;

  const [incomeData, setIncomeData] = useState<IncomeData[] | null>(null);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [deletedRow, setDeletedRow] = useState<IncomeData | null>(null);
  const [openDialog, setOpenDialog] = useState(false); 
 

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

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleViewModeChange = (mode: 'table' | 'chart') => {
    setViewMode(mode);
  };

  const handleDelete = (id: string) => {
    const deletedRowData = incomeData?.find((row) => row.id === id);
    setDeletedRow(deletedRowData || null);
    setOpenDialog(true); 
  };

  const handleConfirmDelete = () => {
    if (deletedRow && incomeData) {
      const updatedData = incomeData.filter((row) => row.id !== deletedRow.id);
      setIncomeData(updatedData);
      setSnackbarOpen(true);
    }
    setOpenDialog(false);
  };

  const handleUndoDelete = () => {
    if (deletedRow && incomeData) {
      setIncomeData([...incomeData, deletedRow]);
      setSnackbarOpen(false);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const paginatedData = incomeData?.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Box sx={{ 
      p: 3,
      backgroundColor: theme.palette.background.default,
      minHeight: '100vh'
    }}>
      <Typography variant="h4" gutterBottom sx={{ color: theme.palette.text.primary }}>
        {t('financial_overview')}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {incomeData === null ? (
          Array(3).fill(null).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ backgroundColor: theme.palette.background.paper }}>
                <CardContent>
                  <Skeleton width="60%" height={24} style={{ marginBottom: '12px' }} />
                  <Skeleton width="40%" height={32} />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ backgroundColor: theme.palette.background.paper }}>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom   sx={{ fontWeight: 'bold' }} >
                    {t('salary')}
                  </Typography>
                  <Typography variant="h4" sx={{ color: aggregatedData?.totalSalary > 0 ? theme.palette.success.main : theme.palette.error.main }}>
                    €{aggregatedData?.totalSalary.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ backgroundColor: theme.palette.background.paper }}>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom   sx={{ fontWeight: 'bold' }} >
                    {t('investments')}
                  </Typography>
                  {incomeData[0].investments.length === 0 ? (
                    <Typography variant="body1">{t('no_investments')}</Typography>
                  ) : (
                    incomeData[0].investments.map((investment, index) => (
                      <Chip 
                        key={index}
                        label={`${investment.type}: €${investment.amount.toLocaleString()}`}
                        color="primary"
                        sx={{ 
                          mr: 1, 
                          mb: 1,
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText
                        }}
                      />
                    ))
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ backgroundColor: theme.palette.background.paper }}>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom   sx={{ fontWeight: 'bold' }} >
                    {t('others')}
                  </Typography>
                  <Typography variant="h4" sx={{ color: theme.palette.warning.main }}>
                    €{aggregatedData?.totalOthers.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <ButtonGroup variant="contained">
          <Button
            onClick={() => handleViewModeChange('table')}
            color={viewMode === 'table' ? 'primary' : 'inherit'}
            sx={{
              bgcolor: viewMode === 'table' ? theme.palette.primary.main : theme.palette.action.disabledBackground,
              color: viewMode === 'table' ? theme.palette.primary.contrastText : theme.palette.text.secondary
            }}
          >
            {t('table_view')}
          </Button>
          <Button
            onClick={() => handleViewModeChange('chart')}
            color={viewMode === 'chart' ? 'primary' : 'inherit'}
            sx={{
              bgcolor: viewMode === 'chart' ? theme.palette.primary.main : theme.palette.action.disabledBackground,
              color: viewMode === 'chart' ? theme.palette.primary.contrastText : theme.palette.text.secondary
            }}
          >
            {t('chart_view')}
          </Button>
        </ButtonGroup>
      </Box>

      {viewMode === 'table' ? (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: theme.palette.text.primary }}>
            {t('income_details')}
          </Typography>
          <TableContainer component={Paper} sx={{ backgroundColor: theme.palette.background.paper }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
                  <TableCell sx={{ color: theme.palette.text.primary }}>{t('month')}</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>{t('salary')}</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>{t('investments')}</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>{t('others')}</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>{t('total_income')}</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>{t('actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {incomeData === null ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <LinearProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData?.map((monthData) => (
                    <TableRow 
                      key={monthData.id}
                      sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}
                    >
                      <TableCell sx={{ color: theme.palette.text.primary }}>{monthData.id}</TableCell>
                      <TableCell sx={{ color: theme.palette.text.primary }}>
                        €{monthData.salary.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {monthData.investments.map((investment) => (
                          <Chip
                            key={investment.type}
                            label={`${investment.type}: €${investment.amount.toLocaleString()}`}
                            color="primary"
                            size="small"
                            sx={{ 
                              mr: 1,
                              backgroundColor: theme.palette.primary.main,
                              color: theme.palette.primary.contrastText
                            }}
                          />
                        ))}
                      </TableCell>
                      <TableCell sx={{ color: theme.palette.text.primary }}>
                        €{monthData.others.amount.toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ color: theme.palette.text.primary }}>
                        €{monthData.totalIncome.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Tooltip title={t('delete')}>
                          <IconButton 
                            onClick={() => handleDelete(monthData.id)} 
                            sx={{ color: theme.palette.error.main }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'right', mt: 2 }}>
            <Pagination
              count={incomeData ? Math.ceil(incomeData.length / rowsPerPage) : 1}
              page={page}
              onChange={handlePageChange}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: theme.palette.text.primary
                }
              }}
            />
          </Box>
        </Box>
      ) : (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: theme.palette.text.primary }}>
            {t('financial_health')}
          </Typography>
          {incomeData === null ? (
            <Skeleton variant="rectangular" height={400} />
          ) : (
            <IncomeChartComponent data={incomeData} />
          )}
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="info"
          action={
            <Button color="inherit" size="small" onClick={handleUndoDelete}>
              {t('undo')}
            </Button>
          }
        >
          {t('row_deleted')}
        </Alert>
      </Snackbar>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{t('confirm_delete')}</DialogTitle>
        <DialogContent>{t('are_you_sure_delete')}</DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            {t('cancel')}
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            {t('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Income;
