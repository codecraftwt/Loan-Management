import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import PromptBox from '../PromptBox/Prompt';
import {logout, removeUserDeviceToken} from '../../Redux/Slices/authslice';
import useFetchUserFromStorage from '../../Redux/hooks/useFetchUserFromStorage';
import {m} from 'walstar-rn-responsive';
import Header from '../../Components/Header';

export default function Profile() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const user = useSelector(state => state.auth.user);

  useFetchUserFromStorage();

  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const [isPromptVisible, setIsPromptVisible] = useState(false);

  const navigateToProfileDetails = () => {
    navigation.navigate('ProfileDetails', {profileData: user});
  };

  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  const handleLogout = () => {
    setIsPromptVisible(true);
  };

  const handleConfirmLogout = async () => {
    try {
      await dispatch(removeUserDeviceToken({}));

      await dispatch(logout());

      setTimeout(() => {
        setIsPromptVisible(false);
        navigation.replace('Login');
      }, 200);
    } catch (error) {
      console.error('Error during logout process:', error);
      Alert.alert('Not able to logout');
    }
  };

  const handleCancelLogout = () => {
    setIsPromptVisible(false);
    console.log('Canceled logout');
  };

  return (
    <>
      <View style={styles.container}>
        {/* Header */}
        <Header title="Profile" />

        <ScrollView>
          {/* Profile Information */}
          <View style={styles.profileInfo}>
            {imageError || !user?.profileImage ? (
              <Icon
                name="user"
                size={60}
                color="#b80266"
                style={styles.profileIcon}
              />
            ) : (
              <Image
                source={{uri: user?.profileImage}}
                style={styles.profileImage}
                onError={handleImageError}
              />
            )}

            {user ? (
              <>
                <Text style={styles.profileName}>{user?.userName}</Text>
                <Text style={styles.profileEmail}>{user?.email}</Text>
              </>
            ) : (
              <ActivityIndicator size="small" color="#b80266" />
            )}
          </View>

          <View style={styles.profileContent}>
            <View style={styles.optionsContainer}>
              {/* <TouchableOpacity
                style={styles.option}
                onPress={navigateToSettings}>
                <Icon name="settings" size={20} color="#333333" />
                <Text style={styles.optionText}>Settings</Text>
              </TouchableOpacity> */}

              <TouchableOpacity
                style={styles.option}
                onPress={navigateToProfileDetails}>
                <Icon name="user" size={20} color="#333333" />
                <Text style={styles.optionText}>Personal Details</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  const aadhaarNumber =
                    user?.aadhaarNumber || user?.aadharCardNo;

                  if (aadhaarNumber) {
                    console.log('Aadhar number ----->', aadhaarNumber);
                    navigation.navigate('OldHistoryPage', {
                      aadhaarNumber,
                    });
                  } else {
                    Alert.alert(
                      'Somthing went wrong',
                      'Aadhaar Number not found, please try again later',
                    );
                  }
                }}>
                <Icon name="file-text" size={20} color="#333333" />
                <Text style={styles.optionText}>Loan History</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.option}>
                <Icon name="bell" size={20} color="#333333" />
                <Text style={styles.optionText}>Notifications</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  navigation.navigate('HelpAndSupportScreen');
                }}>
                <Icon name="help-circle" size={20} color="#333333" />
                <Text style={styles.optionText}>Help & Support</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <PromptBox
        visible={isPromptVisible}
        message="Are you sure you want to logout?"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileImage: {
    width: m(100),
    height: m(100),
    borderRadius: m(50),
    borderColor: '#dbd9d9',
    borderWidth: 1,
  },
  profileContent: {
    flexGrow: 1,
    paddingBottom: m(20),
  },
  profileInfo: {
    alignItems: 'center',
    marginVertical: m(20),
  },
  profileIcon: {
    backgroundColor: '#f0f0f0',
    padding: m(20),
    borderRadius: m(40),
    borderColor: '#f5f5f5',
    borderWidth: 2,
  },
  profileName: {
    fontSize: m(24),
    fontFamily: 'Montserrat-Bold',
    color: '#333333',
    marginTop: m(10),
  },
  profileEmail: {
    fontSize: m(14),
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    marginTop: m(5),
  },
  optionsContainer: {
    marginTop: 0,
    paddingHorizontal: m(20),
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: m(15),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  optionText: {
    fontSize: m(16),
    fontFamily: 'Poppins-Regular',
    color: '#333333',
    marginLeft: m(20),
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    borderRadius: m(8),
    paddingVertical: m(12),
    marginHorizontal: m(40),
    marginBottom: m(20),
    alignItems: 'center',
    width: '60%',
    alignSelf: 'center',
  },

  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: m(18),
    fontFamily: 'Poppins-SemiBold',
  },
});
