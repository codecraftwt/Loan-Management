import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Platform,
  KeyboardAvoidingView,
  RefreshControl,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {getLoanByLender, updateLoanStatus} from '../../Redux/Slices/loanSlice';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import PromptBox from '../PromptBox/Prompt';
import Toast from 'react-native-toast-message';
import LoaderSkeleton from '../../Components/LoaderSkeleton';
import {m} from 'walstar-rn-responsive';
import Header from '../../Components/Header';
import {Picker} from '@react-native-picker/picker';

const Outward = ({navigation}) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const {lenderLoans, loading, error} = useSelector(state => state.loans);
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [currentDateType, setCurrentDateType] = useState('start');
  const [tempDate, setTempDate] = useState(new Date());

  const filteredLoans = lenderLoans?.filter(loan =>
    loan?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const formatDate = date => moment(date).format('DD-MM-YYYY');

  const handleStatusUpdate = useCallback(loan => {
    setSelectedLoan(loan);
    setIsPromptVisible(true);
  }, []);

  const handleConfirm = useCallback(async () => {
    const newStatus = selectedLoan?.status === 'pending' ? 'paid' : 'pending';
    try {
      setIsPromptVisible(false);
      await dispatch(
        updateLoanStatus({loanId: selectedLoan._id, status: newStatus}),
      ).unwrap();
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Loan status updated successfully',
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: err.message || 'Error updating loan status',
      });
    } finally {
      setIsPromptVisible(false);
    }
  }, [dispatch, selectedLoan]);

  const handleClearFilters = () => {
    setStartDateFilter(null);
    setEndDateFilter(null);
    setMinAmount('');
    setMaxAmount('');
    setStatusFilter(null);
    dispatch(getLoanByLender());
    setIsFilterModalVisible(false);
  };

  const handleSubmitFilters = async () => {
    console.log('Submit');
    const filters = {
      startDate: startDateFilter
        ? moment(startDateFilter).format('YYYY-MM-DD')
        : null,
      endDate: endDateFilter
        ? moment(endDateFilter).format('YYYY-MM-DD')
        : null,
      minAmount: minAmount || null,
      maxAmount: maxAmount || null,
      status: statusFilter || null,
    };
    setIsFilterModalVisible(false);
    await dispatch(getLoanByLender(filters));
  };

  const handleCancel = useCallback(() => {
    setSelectedLoan(null);
    setIsPromptVisible(false);
  }, []);

  const onRefresh = useCallback(async () => {
    await dispatch(getLoanByLender());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getLoanByLender());
  }, [dispatch]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header title="My Given Loans" />

      <View style={styles.searchBarContainer}>
        <View style={{flex: 1, flexDirection: 'row', position: 'relative'}}>
          <TextInput
            style={[styles.searchInput, {paddingRight: m(45)}]}
            placeholder="Search by Name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#888"
          />
          <Icon
            name="adjust"
            size={30}
            color="#b80266"
            onPress={() => setIsFilterModalVisible(true)}
            style={{
              position: 'absolute',
              right: m(10),
              top: '45%',
              transform: [{translateY: -m(12)}],
            }}
          />
        </View>

        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => navigation.navigate('AddDetails')}>
          <Text style={styles.plusButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isFilterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsFilterModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsFilterModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Loans</Text>

            {/* Date Filters */}
            <TouchableOpacity
              onPress={() => {
                setCurrentDateType('start');
                setTempDate(startDateFilter || new Date());
                setDatePickerOpen(true);
              }}>
              <View style={styles.dateInput}>
                <Text>
                  {startDateFilter
                    ? formatDate(startDateFilter)
                    : 'Select Start Date'}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setCurrentDateType('end');
                setTempDate(endDateFilter || new Date());
                setDatePickerOpen(true);
              }}>
              <View style={styles.dateInput}>
                <Text>
                  {endDateFilter
                    ? formatDate(endDateFilter)
                    : 'Select End Date'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Amount Filters */}
            <TextInput
              style={styles.input}
              placeholder="Min Amount"
              value={minAmount}
              onChangeText={text => setMinAmount(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              placeholder="Max Amount"
              value={maxAmount}
              onChangeText={text => setMaxAmount(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              placeholderTextColor="#888"
            />

            {/* Status Filter */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={statusFilter}
                onValueChange={setStatusFilter}
                style={styles.picker}>
                <Picker.Item label="Select Status" value={null} />
                <Picker.Item label="Pending" value="pending" />
                <Picker.Item label="Paid" value="paid" />
              </Picker>
            </View>

            {/* Modal Buttons */}
            <View style={styles.buttonRow}>
              {/* <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={() => setIsFilterModalVisible(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                style={[styles.button, styles.clearButton]}
                onPress={handleClearFilters}>
                <Text style={styles.buttonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmitFilters}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Date Picker */}
      <DatePicker
        modal
        open={datePickerOpen}
        date={tempDate}
        mode="date" // Set mode to "date" to hide the time picker
        onConfirm={date => {
          if (currentDateType === 'start') {
            setStartDateFilter(date);
          } else {
            setEndDateFilter(date);
          }
          setDatePickerOpen(false);
        }}
        onCancel={() => setDatePickerOpen(false)}
      />

      {loading ? (
        <LoaderSkeleton />
      ) : (
        <ScrollView
          style={styles.nameListContainer}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }>
          {filteredLoans?.length === 0 && filteredLoans?.length > 0 ? (
            <Text style={styles.emptyText}>No loans found</Text>
          ) : (
            filteredLoans?.map((loan, index) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  navigation.navigate('LoanDetailScreen', {
                    loanDetails: loan,
                    isEdit: true,
                  })
                }>
                <View style={styles.dataCard}>
                  <View style={styles.dataContainer}>
                    {loan?.profileImage ? (
                      <Image
                        source={{uri: loan?.profileImage}}
                        style={styles.userImage}
                      />
                    ) : (
                      <Icon
                        name="account-circle"
                        size={40}
                        color="#b80266"
                        style={styles.userIcon}
                      />
                    )}
                    <View style={styles.textContainer}>
                      <Text style={styles.dataLabel}>
                        Full Name:{' '}
                        <Text style={styles.dataText}>{loan.name}</Text>
                      </Text>
                      <Text style={styles.dataLabel}>
                        Loan Amount:{' '}
                        <Text style={styles.dataText}>{loan.amount} Rs</Text>
                      </Text>
                      <Text style={styles.dataLabel}>
                        Status:{' '}
                        <Text
                          style={[
                            styles.dataText,
                            loan.status === 'paid'
                              ? styles.paidStatus
                              : styles.pendingStatus,
                          ]}>
                          {loan.status}
                        </Text>
                      </Text>

                      <Text style={styles.dataLabel}>
                        Loan End Date:{' '}
                        <Text style={styles.dataText}>
                          {formatDate(loan.loanEndDate)}
                        </Text>
                      </Text>
                    </View>
                    {/* {loan?.status === 'pending' && (
                      <TouchableOpacity
                        style={styles.statusUpdateButton}
                        onPress={() => handleStatusUpdate(loan)}>
                        <Icon
                          name={
                            loan.status === 'paid'
                              ? 'check-circle'
                              : 'access-time'
                          }
                          size={20}
                          color="#fff"
                        />
                        <Text style={styles.statusUpdateText}>
                          {loan.status === 'paid'
                            ? 'Mark as Pending'
                            : 'Mark as Paid'}
                        </Text>
                      </TouchableOpacity>
                    )} */}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      <PromptBox
        visible={isPromptVisible}
        message={`Are you sure you want to change the status to ${
          selectedLoan?.status === 'pending' ? 'paid' : 'pending'
        }?`}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  textContainer: {
    flexDirection: 'column',
    marginTop: m(10),
  },
  plusButton: {
    backgroundColor: '#fff',
    borderRadius: m(20),
    width: m(38),
    height: m(38),
    justifyContent: 'center',
    alignItems: 'center',
    // elevation: m(2),
    marginLeft: m(10),
    top: m(3),
    borderWidth: m(0.1),
  },
  plusButtonText: {
    fontSize: m(28),
    fontWeight: 'bold',
    color: '#b80266',
  },
  nameListContainer: {
    marginBlock: m(10),
    marginBottom: m(20),
    paddingHorizontal: m(15),
  },
  emptyText: {
    textAlign: 'center',
    fontSize: m(16),
    color: '#888',
    marginTop: m(50),
  },
  dataCard: {
    backgroundColor: '#ffffff',
    borderRadius: m(18),
    padding: m(10),
    marginBottom: m(10),
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: m(6),
    flex: 1,
  },
  userIcon: {
    marginHorizontal: m(10),
    marginLeft: m(20),
  },
  userImage: {
    width: m(60),
    height: m(60),
    borderRadius: m(60),
    marginLeft: m(10),
  },
  dataLabel: {
    fontSize: m(14),
    fontWeight: '600',
    color: '#555',
    marginBottom: m(3),
    marginLeft: m(20),
  },
  dataText: {
    fontSize: m(14),
    color: '#333',
  },
  searchBarContainer: {
    flexDirection: 'row',
    paddingHorizontal: m(15),
    marginTop: m(20),
    marginBottom: m(15),
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: m(20),
    paddingHorizontal: m(15),
    height: m(50),
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: m(16),
    color: '#000',
  },
  loader: {
    marginTop: m(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusUpdateButton: {
    marginLeft: m(10),
    marginRight: m(5),
    backgroundColor: '#b80266',
    padding: m(6),
    borderRadius: m(5),
    alignItems: 'center',
  },
  statusUpdateText: {
    fontSize: m(11),
    color: '#fff',
    fontWeight: '600',
  },

  paidStatus: {
    color: 'green',
  },
  pendingStatus: {
    color: 'red',
  },
  filterIcon: {},
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: m(18),
    fontWeight: 'bold',
    color: '#b80266',
    marginBottom: m(20),
    textAlign: 'center',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: m(10),
    padding: m(10),
    marginBottom: m(10),
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: m(10),
    padding: m(10),
    marginBottom: m(10),
    color: '#000',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: m(10),
    marginBottom: m(10),
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: m(10),
  },
  button: {
    borderRadius: m(10),
    paddingVertical: m(10),
    paddingHorizontal: m(20),
    minWidth: m(80),
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#ccc',
  },
  clearButton: {
    backgroundColor: '#b80266',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Outward;
