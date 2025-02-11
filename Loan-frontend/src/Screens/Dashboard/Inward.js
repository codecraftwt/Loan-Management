import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Image,
  RefreshControl,
  Modal,
} from 'react-native';
import React, {useState, useEffect, useMemo} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {
  getLoanByAadhar,
  updateLoanAcceptanceStatus,
} from '../../Redux/Slices/loanSlice';
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import {logo} from '../../Assets';
import PromptBox from '../PromptBox/Prompt';
import Toast from 'react-native-toast-message';
import LoaderSkeleton from '../../Components/LoaderSkeleton';
import {m} from 'walstar-rn-responsive';
import Header from '../../Components/Header';
import DatePicker from 'react-native-date-picker';
import {Picker} from '@react-native-picker/picker';

export default function Inward({navigation}) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const {loans, totalAmount, loading, error} = useSelector(
    state => state.loans,
  );
  const aadhaarNumber = user?.aadharCardNo;

  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [acceptanceStatus, setAcceptanceStatus] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [currentDateType, setCurrentDateType] = useState('start');
  const [tempDate, setTempDate] = useState(new Date());

  // Filtered loans based on search query
  const filteredLoans = useMemo(() => {
    return loans?.filter(loan => {
      const matchesSearch = loan?.purpose
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesStartDate =
        !startDateFilter ||
        moment(loan.loanStartDate).isSameOrAfter(
          moment(startDateFilter),
          'day',
        );

      const matchesEndDate =
        !endDateFilter ||
        moment(loan.loanEndDate).isSameOrBefore(moment(endDateFilter), 'day');

      const matchesMin = !minAmount || loan.amount >= parseInt(minAmount, 10);
      const matchesMax = !maxAmount || loan.amount <= parseInt(maxAmount, 10);
      const matchesStatus = !statusFilter || loan.status === statusFilter;

      return (
        matchesSearch &&
        matchesStartDate &&
        matchesEndDate &&
        matchesMin &&
        matchesMax &&
        matchesStatus
      );
    });
  }, [
    loans,
    searchQuery,
    startDateFilter,
    endDateFilter,
    minAmount,
    maxAmount,
    statusFilter,
  ]);

  const formatDate = date => moment(date).format('DD-MM-YYYY');

  // Show the prompt when updating the status
  const handleStatusChange = (data, status) => {
    setSelectedLoan(data);
    setAcceptanceStatus(status);
    setIsPromptVisible(true);
  };

  const handleConfirm = async () => {
    setIsPromptVisible(false);
    try {
      await dispatch(
        updateLoanAcceptanceStatus({
          loanId: selectedLoan._id,
          status: acceptanceStatus,
        }),
      ).unwrap();

      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Loan Approval status updated successfully',
      });

      console.log('Loan approval status updated', selectedLoan._id);
    } catch (error) {
      // console.error('Error updating loan status: ', error);
      // console.error('New error message: ', error.response.data.error);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: error.error || 'Error updating loan status',
      });
    }
  };

  const handleClearFilters = () => {
    setStartDateFilter(null);
    setEndDateFilter(null);
    setMinAmount('');
    setMaxAmount('');
    setStatusFilter(null);
  };

  const handleSubmitFilters = () => {
    setIsFilterModalVisible(false);
  };

  const handleCancel = () => {
    setSelectedLoan(null);
    setIsPromptVisible(false);
  };

  // Pull-to-refresh logic
  const onRefresh = async () => {
    // setRefreshing(true);
    await dispatch(getLoanByAadhar(aadhaarNumber));
    // setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      if (aadhaarNumber) {
        dispatch(getLoanByAadhar(aadhaarNumber));
        console.log('API Call Triggered on Screen Focus');
      }
    }, [dispatch, aadhaarNumber]),
  );

  return (
    <View style={styles.container}>
      <Header title="My Taken Loans" />

      <View style={styles.searchBarContainer}>
        <View style={{flex: 1, flexDirection: 'row', position: 'relative'}}>
          <TextInput
            style={[styles.searchInput, {paddingRight: m(45)}]}
            placeholder="Search by purpose.."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#888"
          />
          <Icon
            name="filter-list"
            size={30}
            color="#b80266"
            onPress={() => setIsFilterModalVisible(true)}
            style={{
              position: 'absolute',
              right: m(10),
              top: '35%',
              transform: [{translateY: -m(12)}],
            }}
          />
        </View>
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
              <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={() => setIsFilterModalVisible(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
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

      {/* List of loans */}
      {loading ? (
        <LoaderSkeleton />
      ) : (
        <>
          {/* Display total amount */}
          <View style={styles.totalAmountContainer}>
            <Text style={styles.totalAmountText}>
              Total Pending Loan Amount: {totalAmount} Rs
            </Text>
          </View>

          <ScrollView
            style={styles.nameListContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {loans?.length === 0 && loans?.length > 0 ? (
              <Text style={styles.emptyText}>No loans found</Text>
            ) : (
              loans?.map((data, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    navigation.navigate('PersonalLoan', {
                      loanDetails: data,
                      isEdit: false,
                    })
                  }>
                  <View style={styles.dataCard}>
                    <View style={styles.dataContainer}>
                      <View>
                        {user?.profileImage ? (
                          <Image
                            source={{uri: user.profileImage}}
                            style={styles.profileImage}
                          />
                        ) : (
                          <Icon
                            name="account-circle"
                            size={40}
                            color="#b80266"
                            style={styles.userIcon}
                          />
                        )}
                      </View>
                      <View style={styles.textContainer}>
                        <Text style={styles.dataLabel}>
                          Purpose:{' '}
                          <Text style={styles.dataText}>{data?.purpose}</Text>
                        </Text>
                        <Text style={styles.dataLabel}>
                          Balance:{' '}
                          <Text style={styles.dataText}>{data?.amount}</Text> Rs
                        </Text>

                        {/* Dynamically change the color of loan status text */}
                        <Text style={styles.dataLabel}>
                          Status:{' '}
                          <Text
                            style={[
                              styles.dataText,
                              data.status === 'pending'
                                ? styles.pendingStatus
                                : data.status === 'paid'
                                ? styles.paidStatus
                                : styles.defaultStatus,
                            ]}>
                            {data.status}
                          </Text>
                        </Text>

                        <Text style={styles.dataLabel}>
                          Taken From:{' '}
                          <Text style={styles.dataText}>
                            {data?.lenderId?.userName}
                          </Text>
                        </Text>
                        <Text style={styles.dataLabel}>
                          End Date:{' '}
                          <Text style={styles.dataText}>
                            {formatDate(data?.loanEndDate)}
                          </Text>
                        </Text>
                      </View>
                    </View>

                    {/* Conditional rendering for borrowerAcceptanceStatus */}
                    {data?.borrowerAcceptanceStatus === 'accepted' && (
                      <View style={[styles.statusButton, styles.acceptButton]}>
                        <Text style={styles.statusButtonText}>Accepted</Text>
                      </View>
                    )}

                    {data?.borrowerAcceptanceStatus === 'rejected' && (
                      <View style={[styles.statusButton, styles.rejectButton]}>
                        <Text style={styles.statusButtonText}>Rejected</Text>
                      </View>
                    )}

                    {/* If status is neither 'accepted' nor 'rejected', show Accept/Reject buttons */}
                    {data?.borrowerAcceptanceStatus !== 'accepted' &&
                      data?.borrowerAcceptanceStatus !== 'rejected' && (
                        <View style={styles.statusButtonContainer}>
                          <TouchableOpacity
                            style={[styles.statusButton, styles.acceptButton]}
                            onPress={() =>
                              handleStatusChange(data, 'accepted')
                            }>
                            <Text style={styles.statusButtonText}>Accept</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.statusButton, styles.rejectButton]}
                            onPress={() =>
                              handleStatusChange(data, 'rejected')
                            }>
                            <Text style={styles.statusButtonText}>Reject</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </>
      )}

      <PromptBox
        visible={isPromptVisible}
        message={`Are you sure you want to ${acceptanceStatus?.slice(
          0,
          -2,
        )} this loan?`}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileImage: {
    width: m(60),
    height: m(60),
    borderRadius: m(60),
  },
  totalAmountContainer: {
    paddingHorizontal: m(18),
    marginTop: m(10),
    borderBottomColor: '#ddd',
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
  totalAmountText: {
    fontSize: m(16),
    fontWeight: 'bold',
    color: '#b80266',
    padding: m(15),
    backgroundColor: 'white',
    borderRadius: m(18),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: m(2)},
    shadowOpacity: 0.1,
    shadowRadius: m(5),
    elevation: m(3),
  },
  loadingText: {
    textAlign: 'center',
    fontSize: m(16),
    marginTop: m(20),
  },
  emptyText: {
    textAlign: 'center',
    fontSize: m(16),
    color: '#888',
    marginTop: m(50),
  },
  nameListContainer: {
    marginTop: m(20),
    paddingHorizontal: m(15),
  },
  dataCard: {
    backgroundColor: '#ffffff',
    borderRadius: m(18),
    padding: m(15),
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
    marginHorizontal: m(8),
  },
  textContainer: {
    flexDirection: 'column',
    paddingHorizontal: m(10),
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
  pendingStatus: {
    color: 'red',
    fontWeight: 'bold',
  },
  paidStatus: {
    color: 'green',
    fontWeight: 'bold',
  },
  defaultStatus: {
    color: '#333',
  },
  statusButtonContainer: {
    flexDirection: 'column',
    gap: m(5),
    justifyContent: 'space-between',
  },
  statusButton: {
    paddingVertical: m(4),
    paddingHorizontal: m(6),
    borderRadius: m(6),
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
  },
  rejectButton: {
    backgroundColor: '#F44336',
    color: '#fff',
  },
  statusButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: m(13),
  },
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
    maxHeight: '60%',
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
