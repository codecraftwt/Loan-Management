import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useDispatch, useSelector} from 'react-redux';
import {getLoanByAadhar} from '../../Redux/Slices/loanSlice';
import {m} from 'walstar-rn-responsive';
import LoaderSkeleton from '../../Components/LoaderSkeleton';
import AgreementModal from '../PromptBox/AgreementModal';

const OldHistoryPage = ({route, navigation}) => {
  const {aadharNo} = route.params;
  const [expandedLoanIndex, setExpandedLoanIndex] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLoanAgreement, setSelectedLoanAgreement] = useState(null);
  const dispatch = useDispatch();
  const {loans, totalAmount, loading, error} = useSelector(
    state => state.loans,
  );

  useEffect(() => {
    if (aadharNo) {
      try {
        dispatch(getLoanByAadhar(aadharNo));
      } catch (error) {
        console.log(error, 'Error');
      }
    }
  }, [aadharNo, dispatch]);

  const toggleDetails = index => {
    setExpandedLoanIndex(expandedLoanIndex === index ? null : index);
  };

  const borrower = loans && loans[0];

  const handleViewAgreement = agreement => {
    setSelectedLoanAgreement(agreement); // Set the selected loan agreement
    setIsModalVisible(true); // Show the modal
  };

  return (
    <>
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Old History Details</Text>
      </View>

      {loading ? (
        <LoaderSkeleton />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {error ? (
            <Text style={styles.emptyText}>{error.message}</Text>
          ) : (
            <View style={styles.container}>
              <View style={styles.profileInfo}>
                {borrower?.userProfileImage ? (
                  <Image
                    source={{uri: borrower?.userProfileImage}}
                    style={styles.profileImage}
                  />
                ) : (
                  <Icon
                    name="user"
                    size={50}
                    color="#b80266"
                    style={styles.profileIcon}
                  />
                )}

                <Text style={styles.detailTextName}>{borrower?.name}</Text>
                <Text style={styles.aadharHeading}>
                  Aadhar No: {aadharNo || borrower?.aadhaarNumber}
                </Text>
                <Text style={styles.detailText}>
                  Mobile: {borrower?.mobileNumber}
                </Text>
                <Text style={styles.detailText}>
                  Address: {borrower?.address}
                </Text>
              </View>

              <Text style={styles.totalAmountText}>
                Total Pending Loan Amount: {totalAmount} Rs
              </Text>

              {/* Render Loan details */}
              {loans &&
                loans.map((loan, index) => (
                  <View key={loan._id} style={styles.loanItem}>
                    <TouchableOpacity
                      onPress={() => toggleDetails(index)}
                      style={styles.loanNameContainer}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text style={styles.loanName}>
                          {loan?.purpose?.split(' ').slice(0, 3).join(' ')}
                        </Text>
                        <Text style={styles.loanName}>({loan?.amount} Rs)</Text>
                      </View>

                      <Icon
                        name={
                          expandedLoanIndex === index
                            ? 'chevron-up'
                            : 'chevron-down'
                        }
                        size={18}
                        color="#b80266"
                      />
                    </TouchableOpacity>

                    {expandedLoanIndex === index && (
                      <View style={styles.loanDetailsContainer}>
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
                        <Text style={styles.loanDetailText}>
                          Status: {loan?.status}
                        </Text>

                        {/* Lender details */}
                        <Text style={styles.lenderDetailTitle}>
                          Loan given by
                        </Text>
                        <View style={styles.lenderDetailsContainer}>
                          <Text style={styles.lenderDetailText}>
                            Lender: {loan?.lenderId?.userName}
                          </Text>
                          <Text style={styles.lenderDetailText}>
                            Email: {loan?.lenderId?.email}
                          </Text>
                          <Text style={styles.lenderDetailText}>
                            Mobile: {loan?.lenderId?.mobileNo}
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={styles.linkButton}
                          onPress={() => handleViewAgreement(loan.agreement)}>
                          <Text style={styles.linkText}>View Agreement</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity
                          onPress={() =>
                            Linking.openURL(loan?.digitalSignature)
                          }
                          style={styles.linkButton}>
                          <Text style={styles.linkText}>
                            View Digital Signature
                          </Text>
                        </TouchableOpacity> */}
                      </View>
                    )}
                  </View>
                ))}
            </View>
          )}
        </ScrollView>
      )}

      <AgreementModal
        isVisible={isModalVisible}
        agreement={selectedLoanAgreement}
        onClose={() => setIsModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: m(20),
    backgroundColor: '#f5f5f5',
  },
  headerBar: {
    backgroundColor: '#b80266',
    height: m(70),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: m(15),
    borderBottomEndRadius: m(15),
    borderBottomStartRadius: m(15),
  },
  backButton: {
    position: 'absolute',
    left: m(15),
    top: m(20),
    padding: m(10),
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: m(20),
    fontFamily: 'Montserrat-Bold',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: m(20),
    backgroundColor: '#b80266',
    paddingVertical: m(20),
    paddingHorizontal: m(25),
    borderRadius: m(16),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: m(4)},
    shadowOpacity: 0.1,
    shadowRadius: m(10),
    elevation: 5,
  },
  profileIcon: {
    backgroundColor: 'white',
    padding: m(15),
    borderRadius: m(40),
    marginBottom: m(10),
  },
  profileImage: {
    width: m(100),
    height: m(100),
    borderRadius: m(50),
    borderColor: '#dbd9d9',
    borderWidth: 1,
    marginBottom: m(5),
  },
  aadharHeading: {
    fontSize: m(16),
    fontWeight: 'bold',
    backgroundColor: '#FFF',
    color: '#b80266',
    padding: m(10),
    paddingHorizontal: m(30),
    margin: m(8),
    borderRadius: m(10),
  },
  detailTextName: {
    fontSize: m(20),
    fontWeight: 'bold',
    color: '#FFF',
  },
  detailText: {
    fontSize: m(16),
    fontWeight: 'bold',
    color: '#FFF',
  },
  totalAmountText: {
    fontSize: m(18),
    fontWeight: 'bold',
    color: '#b80266',
    marginBottom: m(20),
    padding: m(15),
    backgroundColor: '#f0f0f0',
    borderRadius: m(10),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: m(2)},
    shadowOpacity: 0.1,
    shadowRadius: m(5),
    elevation: 3,
  },
  loanItem: {
    marginBottom: m(20),
  },
  loanNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: m(15),
    backgroundColor: '#f9f9f9',
    borderRadius: m(12),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: m(2)},
    shadowOpacity: 0.1,
    shadowRadius: m(5),
    elevation: 3,
  },
  loanName: {
    fontSize: m(16),
    fontWeight: '600',
    color: '#333',
  },
  loanDetailsContainer: {
    backgroundColor: '#fafafa',
    borderRadius: m(8),
    marginTop: m(10),
    paddingVertical: m(15),
    paddingHorizontal: m(20),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: m(4)},
    shadowOpacity: 0.1,
    shadowRadius: m(10),
    elevation: 3,
  },
  loanDetailText: {
    fontSize: m(14),
    color: '#555',
    marginBottom: m(6),
  },
  lenderDetailTitle: {
    fontSize: m(16),
    color: '#333',
    fontWeight: 'bold',
    marginTop: m(12),
  },
  lenderDetailsContainer: {
    paddingLeft: m(20),
    marginTop: m(6),
    marginBottom: m(12),
  },
  lenderDetailText: {
    fontSize: m(14),
    color: '#555',
    marginBottom: m(4),
  },
  linkButton: {
    marginTop: m(12),
    paddingVertical: m(10),
    paddingHorizontal: m(16),
    backgroundColor: '#b80266',
    borderRadius: m(6),
    marginBottom: 0,
  },
  linkText: {
    fontSize: m(14),
    color: '#FFF',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: m(16),
    color: '#888',
    marginTop: m(60),
  },
});

export default OldHistoryPage;
