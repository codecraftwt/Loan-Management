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

  // Format dates using moment
  const formatDate = date => moment(date).format('DD-MM-YYYY');

  // Default profile icon
  const defaultProfileIcon = (
    <Icon name="user" size={50} color="#FFFFFF" style={styles.profileIcon} />
  );

  // Check if the user has an image or fall back to the default icon
  const profileImage = loanDetails.profileImage
    ? {uri: loanDetails.profileImage}
    : null;

  const handleEdit = () => {
    navigation.navigate('AddDetails', {loanDetails}); // Navigate to Edit Screen
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
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Loan Details</Text>
        {/* Edit Icon */}
        {isEdit && (
          <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
            <Icon name="edit" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* ScrollView for loan details */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Loan Information */}
        <View style={styles.loanInfoContainer}>
          <Text style={styles.loanTitle}>Loan Overview</Text>

          {/* Profile Section */}
          <View style={styles.profileInfo}>
            {profileImage ? (
              <Image source={profileImage} style={styles.profileImage} />
            ) : (
              defaultProfileIcon // Default profile icon when no image is found
            )}
            <Text style={styles.name}>{loanDetails.name}</Text>
          </View>

          <View>
            <Text
              style={[
                styles.loanAcceptanceStatus,
                getStatusStyle(loanDetails.borrowerAcceptanceStatus),
              ]}>
              Loan acceptance status: {loanDetails.borrowerAcceptanceStatus}
            </Text>
          </View>

          {/* Full Name */}
          <View style={styles.row}>
            <Icon name="user" size={28} color="#b80266" style={styles.icon} />
            <View style={styles.dataContainer}>
              <Text style={styles.label}>Full Name</Text>
              <Text style={styles.value}>{loanDetails.name}</Text>
            </View>
          </View>
          <View style={styles.separator} />

          {/* Contact No */}
          <View style={styles.row}>
            <Icon name="phone" size={28} color="#b80266" style={styles.icon} />
            <View style={styles.dataContainer}>
              <Text style={styles.label}>Contact No</Text>
              <Text style={styles.value}>{loanDetails.mobileNumber}</Text>
            </View>
          </View>
          <View style={styles.separator} />

          {/* Aadhar No */}
          <View style={styles.row}>
            <Icon
              name="credit-card"
              size={28}
              color="#b80266"
              style={styles.icon}
            />
            <View style={styles.dataContainer}>
              <Text style={styles.label}>Aadhar Card No</Text>
              <Text style={styles.value}>{loanDetails.aadhaarNumber}</Text>
            </View>
          </View>
          <View style={styles.separator} />

          {/* Loan Balance */}
          <View style={styles.row}>
            <Icon
              name="dollar-sign"
              size={28}
              color="#b80266"
              style={styles.icon}
            />
            <View style={styles.dataContainer}>
              <Text style={styles.label}>Loan Amount</Text>
              <Text style={styles.value}>{loanDetails.amount} Rs</Text>
            </View>
          </View>
          <View style={styles.separator} />

          {/* Loan Status */}
          <View style={styles.row}>
            <Icon
              name="check-circle"
              size={28}
              color="#b80266"
              style={styles.icon}
            />
            <View style={styles.dataContainer}>
              <Text style={styles.label}>Loan Status</Text>
              <Text style={styles.value}>{loanDetails.status}</Text>
            </View>
          </View>
          <View style={styles.separator} />

          {/* Purpose */}
          <View style={styles.row}>
            <Icon name="book" size={28} color="#b80266" style={styles.icon} />
            <View style={styles.dataContainer}>
              <Text style={styles.label}>Purpose</Text>
              <Text style={styles.value}>{loanDetails.purpose}</Text>
            </View>
          </View>
          <View style={styles.separator} />

          {/* Start Date */}
          <View style={styles.row}>
            <Icon
              name="calendar"
              size={28}
              color="#b80266"
              style={styles.icon}
            />
            <View style={styles.dataContainer}>
              <Text style={styles.label}>Loan Start Date</Text>
              <Text style={styles.value}>
                {formatDate(loanDetails.loanStartDate)}
              </Text>
            </View>
          </View>
          <View style={styles.separator} />

          {/* End Date */}
          <View style={styles.row}>
            <Icon
              name="calendar"
              size={28}
              color="#b80266"
              style={styles.icon}
            />
            <View style={styles.dataContainer}>
              <Text style={styles.label}>Loan End Date</Text>
              <Text style={styles.value}>
                {formatDate(loanDetails.loanEndDate)}
              </Text>
            </View>
          </View>
          <View style={styles.separator} />

          <View style={styles.row}>
            <Icon
              name="arrow-down-circle"
              size={28}
              color="#b80266"
              style={styles.icon}
            />
            <View style={styles.dataContainer}>
              <Text style={styles.label}>Loan Taken From</Text>
              <Text style={styles.value}>
                {loanDetails?.lenderId?.userName}
              </Text>
            </View>
          </View>
          <View style={styles.separator} />

          {/* Address */}
          <View style={styles.row}>
            <Icon
              name="map-pin"
              size={28}
              color="#b80266"
              style={styles.icon}
            />
            <View style={styles.dataContainer}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>{loanDetails.address}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  editButton: {
    position: 'absolute',
    right: m(20),
    top: m(30),
  },

  headerBar: {
    backgroundColor: '#b80266',
    height: m(70),
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: m(15),
    borderBottomEndRadius: m(30),
    borderBottomStartRadius: m(30),
    paddingHorizontal: m(20),
  },
  backButton: {
    marginRight: m(20),
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: m(20),
    fontFamily: 'Montserrat-Bold',
  },

  scrollContainer: {
    paddingBottom: m(20),
  },

  loanAcceptanceStatus: {
    fontSize: m(13),
    fontFamily: 'Poppins-Bold',
    marginBottom: m(20),
    padding: m(8),
    borderRadius: m(8),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: m(4)},
    shadowOpacity: 0.1,
    shadowRadius: m(10),
    elevation: m(5),
    textAlign: 'center',
    letterSpacing: m(1.5),
  },

  acceptedStatus: {
    backgroundColor: '#28a745',
    color: 'white',
  },

  rejectedStatus: {
    backgroundColor: '#dc3545',
    color: 'white',
  },

  pendingStatus: {
    backgroundColor: '#ffc107',
    color: 'white',
  },

  profileInfo: {
    alignItems: 'center',
    marginTop: m(10),
    marginBottom: m(20),
    backgroundColor: '#b80266',
    paddingVertical: m(20),
    paddingHorizontal: m(25),
    borderRadius: m(16),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: m(4)},
    shadowOpacity: 0.1,
    shadowRadius: m(10),
    elevation: m(5),
  },

  profileImage: {
    width: m(90),
    height: m(90),
    borderRadius: m(50),
    marginBottom: m(10),
    borderWidth: m(2),
    borderColor: 'white',
  },

  profileIcon: {
    backgroundColor: '#f0f0f0',
    padding: m(15),
    borderRadius: m(40),
    borderColor: '#f5f5f5',
    color: '#b80266',
    marginBottom: m(10),
  },

  name: {
    fontSize: m(22),
    fontFamily: 'Montserrat-Bold',
    color: '#FFFFFF',
    marginBottom: m(10),
  },

  loanInfoContainer: {
    marginTop: m(20),
    paddingHorizontal: m(20),
    backgroundColor: '#F7F7F7',
    borderRadius: m(16),
    paddingVertical: m(20),
    marginHorizontal: m(16),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: m(4)},
    shadowOpacity: 0.1,
    shadowRadius: m(10),
    elevation: m(5),
  },

  loanTitle: {
    fontSize: m(22),
    fontFamily: 'Montserrat-Bold',
    color: '#b80266',
    marginBottom: m(15),
    textAlign: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: m(12),
  },

  icon: {
    marginRight: m(15),
  },

  dataContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },

  label: {
    fontSize: m(16),
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },

  value: {
    fontSize: m(14),
    fontFamily: 'Poppins-Regular',
    color: '#555',
  },

  separator: {
    borderBottomWidth: m(1),
    borderBottomColor: '#E0E0E0',
    marginVertical: m(8),
  },
});
