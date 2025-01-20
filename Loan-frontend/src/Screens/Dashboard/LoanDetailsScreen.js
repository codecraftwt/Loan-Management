import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import moment from 'moment';
import {m} from 'walstar-rn-responsive';

export default function LoanDetailScreen({route, navigation}) {
  const {loanDetails, isEdit} = route.params;

  const handleBack = () => {
    navigation.goBack();
  };

  const formatDate = date => moment(date).format('DD MMM, YYYY');

  const defaultProfileIcon = (
    <Icon name="user" size={50} color="#FFFFFF" style={styles.profileIcon} />
  );

  const profileImage = loanDetails.profileImage
    ? {uri: loanDetails.profileImage}
    : null;

  const handleEdit = () => {
    navigation.navigate('AddDetails', {loanDetails});
  };

  const getStatusStyle = status => {
    switch (status) {
      case 'accepted':
        return styles.acceptedStatus;
      case 'rejected':
        return styles.rejectedStatus;
      case 'pending':
      default:
        return styles.pendingStatus;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Loan Details</Text>
        {/* Edit Icon */}
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
            {profileImage ? (
              <Image source={profileImage} style={styles.profileImage} />
            ) : (
              <Icon
                name="user"
                size={50}
                color="#6A6A6A"
                style={styles.profileIcon}
              />
            )}
            <Text style={styles.name}>{loanDetails.name}</Text>
          </View>

          <Text
            style={[
              styles.loanAcceptanceStatus,
              getStatusStyle(loanDetails.borrowerAcceptanceStatus),
            ]}>
            Loan Status: {loanDetails.borrowerAcceptanceStatus}
          </Text>

          {/* Loan Info Rows */}
          {[
            {label: 'Full Name', value: loanDetails.name, icon: 'user'},
            {
              label: 'Contact No',
              value: loanDetails.mobileNumber,
              icon: 'phone',
            },
            {
              label: 'Aadhar Card No',
              value: loanDetails.aadhaarNumber,
              icon: 'credit-card',
            },
            {
              label: 'Loan Amount',
              value: `${loanDetails.amount} Rs`,
              icon: 'dollar-sign',
            },
            {
              label: 'Loan Status',
              value: loanDetails.status,
              icon: 'check-circle',
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
            {
              label: 'Loan Taken From',
              value: loanDetails?.lenderId?.userName,
              icon: 'arrow-down-circle',
            },
            {label: 'Address', value: loanDetails.address, icon: 'map-pin'},
          ].map((item, index) => (
            <View key={index} style={styles.row}>
              <Icon
                name={item.icon}
                size={28}
                color="#B80266"
                style={styles.icon}
              />
              <View style={styles.dataContainer}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerBar: {
    backgroundColor: '#B80266',
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
    textAlign: 'center',
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
    color: '#B80266',
    textAlign: 'center',
    marginBottom: m(20),
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: m(20),
  },
  profileImage: {
    width: m(90),
    height: m(90),
    borderRadius: m(45),
    marginBottom: m(10),
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  profileIcon: {
    backgroundColor: '#E0E0E0',
    padding: m(15),
    borderRadius: m(45),
  },
  name: {
    fontSize: m(20),
    fontFamily: 'Montserrat-SemiBold',
    color: '#333',
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
});
