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
import {m} from 'walstar-rn-responsive';
import {useSelector} from 'react-redux';
import AgreementModal from '../PromptBox/AgreementModal';

const LoanDetailRow = ({label, value, icon}) => (
  <View style={styles.row}>
    <Icon name={icon} size={28} color="#b80266" style={styles.icon} />
    <View style={styles.dataContainer}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

export default function PersonalLoan({route, navigation}) {
  const {loanDetails, isEdit} = route.params;
  const user = useSelector(state => state.auth.user);

  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const loanInfo = [
    {
      label: 'Loan Amount',
      value: `${loanDetails.amount} Rs`,
      icon: 'dollar-sign',
    },
    {label: 'Loan Status', value: loanDetails.status, icon: 'check-circle'},
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
    {
      label: 'Loan Taken From',
      value: loanDetails?.lenderId?.userName,
      icon: 'arrow-down-circle',
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
            {user?.profileImage ? (
              <Image
                source={{uri: user.profileImage}}
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

          <TouchableOpacity
            style={styles.viewAgreementButton}
            onPress={() => setIsModalVisible(true)}>
            <Text style={styles.viewAgreementText}>View Agreement</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AgreementModal
        isVisible={isModalVisible}
        agreement={loanDetails.agreement}
        onClose={() => setIsModalVisible(false)}
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
    backgroundColor: '#b80266',
    paddingVertical: m(12),
    paddingHorizontal: m(20),
    borderRadius: m(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusUpdateText: {
    color: '#FFF',
    fontSize: m(16),
    fontFamily: 'Poppins-SemiBold',
  },
  viewAgreementButton: {
    backgroundColor: '#b80266',
    paddingVertical: m(12),
    paddingHorizontal: m(20),
    borderRadius: m(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: m(20),
  },
  viewAgreementText: {
    color: '#FFF',
    fontSize: m(16),
    fontFamily: 'Poppins-SemiBold',
  },
});
