import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import instance from '../../Utils/AxiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  loans: [],
  totalAmount: 0,
  lenderLoans: [],
  myLoans: [],
  lenderTotalAmount: 0,
  loanStats: [],
  loading: true,
  error: null,
  aadharError: null,
};

// Thunks for various actions
export const getLoanByAadhar = createAsyncThunk(
  'loans/getLoanByAadhar',
  async (aadhaarNumber, {rejectWithValue}) => {
    try {
      const response = await instance.get('loan/get-loan-by-aadhar', {
        params: {aadhaarNumber},
      });
      if (response.status === 404 && response.data.message) {
        return rejectWithValue(response.data.message || 'Loan not found');
      }
      return {
        loans: response.data.data,
        totalAmount: response.data.totalAmount,
      };
    } catch (error) {
      console.log(error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || error.message || 'Unknown error',
      );
    }
  },
);

export const getLoanByLender = createAsyncThunk(
  'loans/getLoanByLender',
  async (_, {rejectWithValue}) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return rejectWithValue('User is not authenticated');
      }
      const response = await instance.get('loan/get-loan-by-lender', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
      });

      if (response.status === 404 && response.data.message) {
        return rejectWithValue(
          response.data.message || 'No loans found for this lender',
        );
      }

      return {
        lenderLoans: response.data.data,
        lenderTotalAmount: response.data.totalAmount,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Unknown error');
    }
  },
);

export const createLoan = createAsyncThunk(
  'loans/createLoan',
  async (loanData, {rejectWithValue}) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return rejectWithValue('User is not authenticated');
      }

      const response = await instance.post('loan/add-loan', loanData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('API Error:', error.response.data);
        return rejectWithValue(error.response.data || 'Failed to create loan');
      }
      console.error('Error:', error.message);
      return rejectWithValue(error.message || 'Unknown error');
    }
  },
);

export const updateLoanStatus = createAsyncThunk(
  'loans/updateLoanStatus',
  async ({loanId, status}, {rejectWithValue}) => {
    try {
      console.log('API call for update status', loanId);
      const response = await instance.patch(
        `loan/update-loan-status/${loanId}`,
        {status},
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log('Fail', error.message);
      return rejectWithValue(error.message || 'Unknown error');
    }
  },
);

export const updateLoanAcceptanceStatus = createAsyncThunk(
  'loans/updateLoanAcceptanceStatus',
  async ({loanId, status}, {rejectWithValue}) => {
    try {
      console.log('API call for update status', loanId);
      const response = await instance.patch(
        `loan/update-loan-acceptance-status/${loanId}`,
        {status},
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log('Failed loan status update', error.response.data);
      return rejectWithValue(error.response.data || 'Unknown error');
    }
  },
);

export const updateLoan = createAsyncThunk(
  'loans/updateLoan',
  async (loanData, {rejectWithValue}) => {
    try {
      const response = await instance.patch(`loan/${loanData.id}`, loanData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating loan:', error);
      return rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

export const getLoanStats = createAsyncThunk(
  'loans/getLoanStats',
  async (aadhaarNumber, {rejectWithValue}) => {
    try {
      const response = await instance.get('loan/loan-stats', {
        params: {aadhaarNumber},
      });

      return response.data;
    } catch (error) {
      console.log(error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || error.message || 'Unknown error',
      );
    }
  },
);

const loanSlice = createSlice({
  name: 'loans',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Handling getLoanByAadhar
      .addCase(getLoanByAadhar.pending, state => {
        state.loading = true;
        state.loans = [];
        state.totalAmount = 0;
        state.aadharError = null;
      })
      .addCase(getLoanByAadhar.fulfilled, (state, action) => {
        state.loading = false;
        state.loans = action.payload.loans;
        state.totalAmount = action.payload.totalAmount;
        state.aadharError = null;
      })
      .addCase(getLoanByAadhar.rejected, (state, action) => {
        state.loading = false;
        state.aadharError =
          action.payload || action.error?.message || 'Something went wrong';
      })

      // Handling getLoanByLender
      .addCase(getLoanByLender.pending, state => {
        state.loading = true;
        state.lenderLoans = [];
        state.lenderTotalAmount = 0;
        state.error = null;
      })
      .addCase(getLoanByLender.fulfilled, (state, action) => {
        state.loading = false;
        state.lenderLoans = action.payload.lenderLoans;
        state.lenderTotalAmount = action.payload.lenderTotalAmount;
        state.error = null;
      })
      .addCase(getLoanByLender.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          'Error fetching lender loans';
      })

      // Handling createLoan
      .addCase(createLoan.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLoan.fulfilled, (state, action) => {
        state.loading = false;
        state.lenderLoans.unshift(action.payload);
        state.error = null;
      })
      .addCase(createLoan.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error?.message || 'Error creating loan';
      })

      // Handling updateLoanStatus
      .addCase(updateLoanStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLoanStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedLoan = action.payload.loan;
        const updatedLoanIndex = state.loans.findIndex(
          loan => loan._id === updatedLoan._id,
        );

        if (updatedLoanIndex >= 0) {
          state.loans[updatedLoanIndex] = updatedLoan;
        }

        const updatedLenderLoanIndex = state.lenderLoans.findIndex(
          loan => loan._id === updatedLoan._id,
        );
        if (updatedLenderLoanIndex >= 0) {
          state.lenderLoans[updatedLenderLoanIndex] = updatedLoan;
        }

        state.error = null;
      })
      .addCase(updateLoanStatus.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          'Error updating loan status';
      })

      //update updateLoanAcceptanceStatus
      .addCase(updateLoanAcceptanceStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLoanAcceptanceStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedLoan = action.payload.loan;
        const updatedLoanIndex = state.loans.findIndex(
          loan => loan._id === updatedLoan._id,
        );

        if (updatedLoanIndex >= 0) {
          state.loans[updatedLoanIndex] = updatedLoan;
        }

        const updatedLenderLoanIndex = state.lenderLoans.findIndex(
          loan => loan._id === updatedLoan._id,
        );
        if (updatedLenderLoanIndex >= 0) {
          state.lenderLoans[updatedLenderLoanIndex] = updatedLoan;
        }

        state.error = null;
      })
      .addCase(updateLoanAcceptanceStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handling updateLoan
      .addCase(updateLoan.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLoan.fulfilled, (state, action) => {
        state.loading = false;
        const updatedLoanIndex = state.lenderLoans.findIndex(
          loan => loan._id === action.payload._id,
        );

        if (updatedLoanIndex >= 0) {
          state.lenderLoans[updatedLoanIndex] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateLoan.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error?.message || 'Error updating loan';
      })

      // Handling getLoanStats
      .addCase(getLoanStats.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLoanStats.fulfilled, (state, action) => {
        state.loading = false;
        state.loanStats = action.payload.data;
        state.error = null;
      })
      .addCase(getLoanStats.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          'Error fetching loan stats';
      });
  },
});

export default loanSlice.reducer;
