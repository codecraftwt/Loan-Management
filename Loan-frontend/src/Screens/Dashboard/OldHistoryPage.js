import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import { getLoanByAadhar } from '../../Redux/Slices/loanSlice';
import { m } from 'walstar-rn-responsive';
import LoaderSkeleton from '../../Components/LoaderSkeleton';
import AgreementModal from '../PromptBox/AgreementModal';
import Header from '../../Components/Header';

const OldHistoryPage = ({ route, navigation }) => {
  const { aadhaarNumber } = route.params;
  const [expandedLoanIndex, setExpandedLoanIndex] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLoanAgreement, setSelectedLoanAgreement] = useState(null);
  const dispatch = useDispatch();
  const { loans, totalAmount, loading, error } = useSelector(
    state => state.loans
  );

  useEffect(() => {
    if (aadhaarNumber) {
      dispatch(getLoanByAadhar({ aadhaarNumber }));
    }
  }, [aadhaarNumber, dispatch]);

  const toggleDetails = index => {
    setExpandedLoanIndex(expandedLoanIndex === index ? null : index);
  };

  const borrower = loans && loans[0];

  const handleViewAgreement = agreement => {
    setSelectedLoanAgreement(agreement);
    setIsModalVisible(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <Header title="Old History Details" showBackButton />

      {loading ? (
        <LoaderSkeleton />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: m(20) }}
        >
          {error ? (
            <Text style={styles.emptyText}>{error.message}</Text>
          ) : (
            <>
              {/* Borrower Profile Card */}
              <View style={styles.profileCard}>
                <View style={{ position: 'relative' }}>
                  {borrower?.userProfileImage ? (
                    <Image
                      source={{ uri: borrower?.userProfileImage }}
                      style={styles.profileImage}
                    />
                  ) : (
                    <Icon
                      name="user"
                      size={60}
                      color="#ff6700"
                      style={styles.profileIcon}
                    />
                  )}

                  {/* Camera icon */}
                  <TouchableOpacity style={styles.cameraIcon}>
                    <Icon name="camera" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.borrowerName}>{borrower?.name}</Text>
                <Text style={styles.aadharText}>
                  Aadhar: {aadhaarNumber || borrower?.aadhaarNumber}
                </Text>
                <Text style={styles.borrowerDetail}>
                  Mobile: {borrower?.mobileNumber}
                </Text>
                <Text style={styles.borrowerDetail}>
                  Address: {borrower?.address}
                </Text>
              </View>

              {/* Total Loan Amount */}
              <View style={styles.totalAmountCard}>
                <Text style={styles.totalAmountText}>
                  Total Pending Loan Amount: {totalAmount} Rs
                </Text>
              </View>

              {/* Loan List */}
              {loans?.map((loan, index) => (
                <View key={loan._id} style={styles.loanCard}>
                  <TouchableOpacity
                    onPress={() => toggleDetails(index)}
                    style={styles.loanHeader}
                  >
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={styles.loanTitle}>
                        {loan?.purpose?.split(' ').slice(0, 3).join(' ')}
                      </Text>
                      <Text style={styles.loanAmount}>({loan?.amount} Rs)</Text>
                    </View>
                    <Icon
                      name={expandedLoanIndex === index ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color="#ff6700"
                    />
                  </TouchableOpacity>

                  {expandedLoanIndex === index && (
                    <View style={styles.loanDetails}>
                      <Text style={styles.loanDetailText}>
                        Loan Amount: {loan?.amount} Rs
                      </Text>
                      <Text style={styles.loanDetailText}>
                        Start Date:{' '}
                        {new Date(loan?.loanStartDate).toLocaleDateString()}
                      </Text>
                      <Text style={styles.loanDetailText}>
                        End Date:{' '}
                        {new Date(loan?.loanEndDate).toLocaleDateString()}
                      </Text>
                      <Text style={styles.loanDetailText}>Status: {loan?.status}</Text>

                      <Text style={styles.lenderTitle}>Loan Given By:</Text>
                      <View style={styles.lenderInfo}>
                        <Text style={styles.lenderText}>
                          Name: {loan?.lenderId?.userName}
                        </Text>
                        <Text style={styles.lenderText}>
                          Email: {loan?.lenderId?.email}
                        </Text>
                        <Text style={styles.lenderText}>
                          Mobile: {loan?.lenderId?.mobileNo}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.viewAgreementBtn}
                        onPress={() => handleViewAgreement(loan.agreement)}
                      >
                        <Text style={styles.viewAgreementText}>View Agreement</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
            </>
          )}
        </ScrollView>
      )}

      <AgreementModal
        isVisible={isModalVisible}
        agreement={selectedLoanAgreement}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: m(20),
    borderRadius: m(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: m(4) },
    shadowOpacity: 0.1,
    shadowRadius: m(8),
    elevation: 5,
    marginBottom: m(20),
  },
  profileImage: {
    width: m(100),
    height: m(100),
    borderRadius: m(50),
    marginBottom: m(10),
  },
  profileIcon: {
    backgroundColor: '#ffe6d5',
    padding: m(15),
    borderRadius: m(40),
    marginBottom: m(10),
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#ff6700',
    padding: m(6),
    borderRadius: m(20),
    borderWidth: 2,
    borderColor: '#fff',
  },
  borrowerName: {
    fontSize: m(18),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: m(5),
  },
  aadharText: {
    fontSize: m(14),
    color: '#ff6700',
    fontWeight: '600',
    marginBottom: m(5),
  },
  borrowerDetail: {
    fontSize: m(14),
    color: '#555',
    marginBottom: m(3),
    textAlign: 'center',
  },
  totalAmountCard: {
    backgroundColor: '#fff',
    padding: m(15),
    borderRadius: m(12),
    marginBottom: m(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: m(2) },
    shadowOpacity: 0.05,
    shadowRadius: m(4),
    elevation: 3,
  },
  totalAmountText: {
    fontSize: m(16),
    fontWeight: 'bold',
    color: '#ff6700',
    textAlign: 'center',
  },
  loanCard: {
    backgroundColor: '#fff',
    borderRadius: m(12),
    marginBottom: m(15),
    padding: m(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: m(2) },
    shadowOpacity: 0.05,
    shadowRadius: m(4),
    elevation: 3,
  },
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loanTitle: {
    fontSize: m(16),
    fontWeight: '600',
    color: '#333',
  },
  loanAmount: {
    fontSize: m(14),
    fontWeight: '600',
    color: '#ff6700',
  },
  loanDetails: {
    marginTop: m(10),
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: m(10),
  },
  loanDetailText: {
    fontSize: m(14),
    color: '#555',
    marginBottom: m(5),
  },
  lenderTitle: {
    fontSize: m(14),
    fontWeight: '700',
    color: '#333',
    marginTop: m(8),
  },
  lenderInfo: {
    paddingLeft: m(10),
    marginBottom: m(10),
  },
  lenderText: {
    fontSize: m(13),
    color: '#555',
    marginBottom: m(3),
  },
  viewAgreementBtn: {
    backgroundColor: '#ff6700',
    paddingVertical: m(10),
    borderRadius: m(8),
    alignItems: 'center',
    marginTop: m(8),
  },
  viewAgreementText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: m(16),
    color: '#888',
    marginTop: m(60),
  },
});

export default OldHistoryPage;
