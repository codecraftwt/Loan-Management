import React, {useEffect, useState, useMemo, useCallback} from 'react';
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
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {getLoanByLender, updateLoanStatus} from '../../Redux/Slices/loanSlice';
import moment from 'moment';
import {logo} from '../../Assets';
import PromptBox from '../PromptBox.js/Prompt';
import Toast from 'react-native-toast-message';
import LoaderSkeleton from '../../Components/LoaderSkeleton';
import {m} from 'walstar-rn-responsive';
import Header from '../../Components/Header';

const Outward = ({navigation}) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const {lenderLoans, loading, error} = useSelector(state => state.loans);
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  useEffect(() => {
    dispatch(getLoanByLender());
  }, [dispatch]);

  // Memoized filter logic for performance optimization
  const filteredLoans = useMemo(() => {
    return lenderLoans?.filter(loan =>
      loan?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [lenderLoans, searchQuery]);

  const formatDate = date => moment(date).format('DD-MM-YYYY');

  // Optimized handler for status update
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

  const handleCancel = useCallback(() => {
    setSelectedLoan(null);
    setIsPromptVisible(false);
  }, []);

  const onRefresh = useCallback(async () => {
    await dispatch(getLoanByLender());
  }, [dispatch]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header title="My Given Loans" />

      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888"
        />
        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => navigation.navigate('AddDetails')}>
          <Text style={styles.plusButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <LoaderSkeleton />
      ) : (
        <ScrollView
          style={styles.nameListContainer}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }>
          {filteredLoans?.length === 0 && lenderLoans?.length > 0 ? (
            <Text style={styles.emptyText}>No loans found</Text>
          ) : (
            filteredLoans.map((loan, index) => (
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
                        <Text style={styles.dataText}>{loan.status}</Text>
                      </Text>
                      <Text style={styles.dataLabel}>
                        Loan End Date:{' '}
                        <Text style={styles.dataText}>
                          {formatDate(loan.loanEndDate)}
                        </Text>
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.statusUpdateButton}
                      onPress={() => handleStatusUpdate(loan)}>
                      <Icon
                        name={
                          loan.status === 'pending'
                            ? 'check-box-outline-blank'
                            : 'check-box'
                        }
                        size={28}
                        color={
                          loan.status === 'pending' ? '#b80266' : '#4CAF50'
                        }
                      />
                    </TouchableOpacity>
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
    flex: 1,
  },
  plusButton: {
    backgroundColor: '#fff',
    borderRadius: m(20),
    width: m(38),
    height: m(38),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: m(1)},
    shadowOpacity: 0.4,
    shadowRadius: m(2),
    elevation: m(4),
    marginLeft: m(10),
    top: m(3),
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
  },
  userImage: {
    width: m(60),
    height: m(60),
    borderRadius: m(60),
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
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: m(15),
    marginTop: m(20),
    marginBottom: m(10),
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
  },
});

export default Outward;
