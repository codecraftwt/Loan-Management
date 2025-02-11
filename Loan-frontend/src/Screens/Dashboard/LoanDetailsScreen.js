import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import moment from 'moment';
import {useDispatch} from 'react-redux';
import {updateLoanStatus} from '../../Redux/Slices/loanSlice'; // Update as per your redux action
import Toast from 'react-native-toast-message';
import {m} from 'walstar-rn-responsive';
import PromptBox from '../PromptBox/Prompt';

const LoanDetailRow = ({label, value, icon, isStatus, onStatusChange}) => (
  <View style={styles.row}>
    <Icon name={icon} size={28} color="#b80266" style={styles.icon} />
    <View style={styles.dataContainer}>
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      {value === 'pending' && (
        <TouchableOpacity
          style={styles.statusUpdateButton}
          onPress={onStatusChange}>
          {/* <Icon
            name={value === 'pending' ? 'clock' : 'check-circle'}
            size={18}
            color="#fff"
          /> */}
          <Text style={styles.statusUpdateText}>
            {value === 'pending' ? 'Mark as Paid' : 'Mark as Pending'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

export default function LoanDetailScreen({route, navigation}) {
  const {loanDetails, isEdit} = route.params;
  const dispatch = useDispatch();

  const [isPromptVisible, setPromptVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const handleBack = () => navigation.goBack();

  const formatDate = date => moment(date).format('DD MMM, YYYY');

  const handleEdit = () => {
    navigation.navigate('AddDetails', {loanDetails});
  };

  const getStatusStyle = status => {
    const statusStyles = {
      accepted: styles.acceptedStatus,
      rejected: styles.rejectedStatus,
      pending: styles.pendingStatus,
    };
    return statusStyles[status] || styles.pendingStatus;
  };

  const updateLoanStatusHandler = newStatus => {
    dispatch(updateLoanStatus({loanId: loanDetails._id, status: newStatus}))
      .unwrap()
      .then(() => {
        Toast.show({
          type: 'success',
          position: 'top',
          text1: `Loan status updated to ${newStatus}`,
        });
        setPromptVisible(false);
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: err.message || 'Error updating loan status',
        });
        setPromptVisible(false);
      });
  };

  const handleStatusChangeClick = () => {
    const newStatus = loanDetails.status === 'pending' ? 'paid' : 'pending';
    setSelectedStatus(newStatus);
    setPromptVisible(true);
  };

  const handleConfirm = () => {
    if (selectedStatus) {
      updateLoanStatusHandler(selectedStatus);
      handleBack();
    }
  };

  const handleCancel = () => {
    setPromptVisible(false);
  };

  const loanInfo = [
    {
      label: 'Loan Amount',
      value: `${loanDetails.amount} Rs`,
      icon: 'dollar-sign',
    },
    {
      label: 'Loan Status',
      value: loanDetails.status,
      icon: 'check-circle',
      isStatus: true,
      onStatusChange: handleStatusChangeClick,
    },
    {label: 'Purpose', value: loanDetails.purpose, icon: 'book'},
    {
      label: 'Loan Start Date',
      value: formatDate(loanDetails.loanStartDate),
      icon: 'calendar',
    },
    {
      label: 'Loan End Date',
      value: formatDate(loanDetails.loanEndDate),
      icon: 'calendar',
    },
    {label: 'Address', value: loanDetails.address, icon: 'map-pin'},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Loan Details</Text>
        {isEdit && (
          <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
            <Icon name="edit" size={24} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.loanInfoContainer}>
          <Text style={styles.loanTitle}>Loan Overview</Text>

          <View style={styles.profileInfo}>
            {loanDetails.profileImage ? (
              <Image
                source={{uri: loanDetails.profileImage}}
                style={styles.profileImage}
              />
            ) : (
              <Icon
                name="user"
                size={42}
                color="#b80266"
                style={styles.profileIcon}
              />
            )}
            <View style={styles.profileTextContainer}>
              <Text style={styles.name}>{loanDetails.name}</Text>
              <Text style={styles.contactNumber}>
                Mob: {loanDetails.mobileNumber}
              </Text>
              <Text style={styles.aadharNumber}>
                Aadhar: {loanDetails.aadhaarNumber}
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.loanAcceptanceStatus,
              getStatusStyle(loanDetails.borrowerAcceptanceStatus),
            ]}>
            Loan Acceptance: {loanDetails.borrowerAcceptanceStatus}
          </Text>

          {loanInfo.map((item, index) => (
            <LoanDetailRow key={index} {...item} />
          ))}
        </View>
      </ScrollView>

      {/* PromptBox for Status Change */}
      <PromptBox
        visible={isPromptVisible}
        message={`Are you sure you want to change the status to ${
          selectedStatus === 'pending' ? 'pending' : 'paid'
        }?`}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerBar: {
    backgroundColor: '#b80266',
    height: m(70),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: m(20),
    borderBottomEndRadius: m(30),
    borderBottomStartRadius: m(30),
    elevation: 4,
  },
  backButton: {
    marginRight: m(20),
  },
  headerText: {
    color: '#FFF',
    fontSize: m(20),
    fontFamily: 'Montserrat-SemiBold',
    flex: 1,
    marginLeft: m(70),
  },
  editButton: {
    position: 'absolute',
    right: m(20),
  },
  scrollContainer: {
    paddingBottom: m(20),
  },
  loanInfoContainer: {
    backgroundColor: '#FFF',
    borderRadius: m(16),
    marginTop: m(20),
    marginHorizontal: m(20),
    padding: m(20),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: m(10),
    elevation: 5,
  },
  loanTitle: {
    fontSize: m(22),
    fontFamily: 'Montserrat-Bold',
    color: '#b80266',
    textAlign: 'center',
    marginBottom: m(20),
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: m(20),
    backgroundColor: '#f2f2f2',
    borderRadius: m(16),
    padding: m(15),
  },
  profileImage: {
    width: m(80),
    height: m(80),
    borderRadius: m(45),
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  profileIcon: {
    backgroundColor: '#FFF',
    padding: m(15),
    borderRadius: m(45),
  },
  profileTextContainer: {
    flex: 1,
    gap: m(5),
    marginLeft: m(20),
  },
  name: {
    fontSize: m(18),
    fontFamily: 'Montserrat-SemiBold',
    color: '#333',
  },
  contactNumber: {
    fontSize: m(15),
    fontFamily: 'Montserrat-SemiBold',
    color: '#555',
  },
  aadharNumber: {
    fontSize: m(15),
    fontFamily: 'Montserrat-SemiBold',
    color: '#555',
  },
  loanAcceptanceStatus: {
    fontSize: m(14),
    fontFamily: 'Poppins-SemiBold',
    marginBottom: m(20),
    paddingVertical: m(10),
    paddingHorizontal: m(15),
    borderRadius: m(8),
    textAlign: 'center',
  },
  acceptedStatus: {
    backgroundColor: '#28A745',
    color: '#FFF',
  },
  rejectedStatus: {
    backgroundColor: '#DC3545',
    color: '#FFF',
  },
  pendingStatus: {
    backgroundColor: '#FFC107',
    color: '#FFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: m(16),
  },
  icon: {
    marginRight: m(15),
  },
  dataContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: m(15),
    fontFamily: 'Poppins-SemiBold',
    color: '#555',
  },
  value: {
    fontSize: m(14),
    fontFamily: 'Poppins-Regular',
    color: '#777',
    marginTop: m(2),
  },
  statusUpdateContainer: {
    marginTop: m(20),
    alignItems: 'center',
  },
  statusUpdateButton: {
    flexDirection: 'row',
    gap: m(4),
    backgroundColor: 'green',
    paddingHorizontal: m(8),
    borderRadius: m(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusUpdateText: {
    color: '#FFF',
    fontSize: m(12),
    fontFamily: 'Poppins-SemiBold',
  },
});
