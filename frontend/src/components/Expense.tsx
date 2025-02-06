import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.tsx';
import { fetchExpensesData } from '../services/api.ts';
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
  useTheme,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BarChartIcon from '@mui/icons-material/BarChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DescriptionIcon from '@mui/icons-material/Description';

interface Expense {
  id: string;
  category: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
}

const Expenses: React.FC = () => {
  const { token } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  const rowsPerPage = 5;

  const [expensesData, setExpensesData] = useState<Expense[] | null>(null);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [deletedRow, setDeletedRow] = useState<Expense | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchExpensesData();
        setExpensesData(data.expenses);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [token]);

  const aggregateData = (data: Expense[] | null) => {
    if (!data) return null;

    return data.reduce(
      (acc, expense) => {
        acc.totalAmount += expense.amount;
        return acc;
      },
      { totalAmount: 0 }
    );
  };

  const aggregatedData = aggregateData(expensesData);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleViewModeChange = (mode: 'table' | 'chart') => {
    setViewMode(mode);
  };

  const handleDelete = (id: string) => {
    const deletedRowData = expensesData?.find((row) => row.id === id);
    setDeletedRow(deletedRowData || null);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    if (deletedRow && expensesData) {
      const updatedData = expensesData.filter((row) => row.id !== deletedRow.id);
      setExpensesData(updatedData);
      setSnackbarOpen(true);
    }
    setOpenDialog(false);
  };

  const handleUndoDelete = () => {
    if (deletedRow && expensesData) {
      setExpensesData([...expensesData, deletedRow]);
      setSnackbarOpen(false);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const paginatedData = expensesData?.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ color: theme.palette.text.primary }}>
        {t('expenses_overview')}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {expensesData === null ? (
          Array(1).fill(null).map((_, index) => (
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
            <Grid item xs={12} sm={6} md={2}>
              <Card sx={{ backgroundColor: theme.palette.background.paper }}>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {t('total_expenses')}
                  </Typography>
                  <Typography variant="h4" sx={{ color: theme.palette.error.main }}>
                    {aggregatedData?.totalAmount.toLocaleString()} 
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
              color: viewMode === 'table' ? theme.palette.primary.contrastText : theme.palette.text.secondary,
            }}
          >
            {t('table_view')}
          </Button>
          <Button
            onClick={() => handleViewModeChange('chart')}
            color={viewMode === 'chart' ? 'primary' : 'inherit'}
            sx={{
              bgcolor: viewMode === 'chart' ? theme.palette.primary.main : theme.palette.action.disabledBackground,
              color: viewMode === 'chart' ? theme.palette.primary.contrastText : theme.palette.text.secondary,
            }}
          >
            {t('chart_view')}
          </Button>
        </ButtonGroup>
      </Box>

      {viewMode === 'table' ? (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: theme.palette.text.primary }}>
            {t('expenses_details')}
          </Typography>
          <TableContainer component={Paper} sx={{ backgroundColor: theme.palette.background.paper }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
                  <TableCell sx={{ color: theme.palette.text.primary }}>{t('category')}</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>{t('amount')}</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>{t('description')}</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>{t('date')}</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>{t('actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expensesData === null ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <LinearProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData?.map((expense) => (
                    <TableRow key={expense.id} sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}>
                      <TableCell sx={{ color: theme.palette.text.primary }}>
                        <Chip
                          label={t(expense.category.toLowerCase())}
                          color="primary"
                          icon={<CategoryIcon />}
                          sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: theme.palette.text.primary }}>
                        €{expense.amount.toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ color: theme.palette.text.primary }}>{t(expense.description.toLowerCase())}</TableCell>
                      <TableCell sx={{ color: theme.palette.text.primary }}>{expense.date}</TableCell>
                      <TableCell>
                        <Tooltip title={t('delete')}>
                          <IconButton onClick={() => handleDelete(expense.id)} sx={{ color: theme.palette.error.main }}>
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
              count={expensesData ? Math.ceil(expensesData.length / rowsPerPage) : 1}
              page={page}
              onChange={handlePageChange}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: theme.palette.text.primary,
                },
              }}
            />
          </Box>
        </Box>
      ) : (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: theme.palette.text.primary }}>
            {t('expenses_chart')}
          </Typography>
          {expensesData === null ? (
            <Skeleton variant="rectangular" height={400} />
          ) : (
            <Box sx={{ p: 3, backgroundColor: theme.palette.background.paper, borderRadius: 2 }}>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                Chart Placeholder (Replace with your chart component)
              </Typography>
            </Box>
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

export default Expenses;