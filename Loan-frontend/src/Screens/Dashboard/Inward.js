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
} from 'react-native';
import React, {useState, useEffect} from 'react';
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

  // Filtered loans based on search query
  const filteredLoans = loans.filter(loan =>
    loan?.purpose?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
        <TextInput
          style={styles.searchInput}
          placeholder="Search by purpose.."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888"
        />
      </View>

      {/* List of loans */}
      {loading ? (
        <LoaderSkeleton />
      ) : (
        <>
          {/* Display total amount */}
          <View style={styles.totalAmountContainer}>
            <Text style={styles.totalAmountText}>
              Total Loan Amount: {totalAmount} Rs
            </Text>
          </View>

          <ScrollView
            style={styles.nameListContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {filteredLoans?.length === 0 && loans?.length > 0 ? (
              <Text style={styles.emptyText}>No loans found</Text>
            ) : (
              filteredLoans.map((data, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    navigation.navigate('LoanDetailScreen', {
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
    paddingHorizontal: m(15),
    marginTop: m(20),
    marginBottom: m(10),
  },
  searchInput: {
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
});
