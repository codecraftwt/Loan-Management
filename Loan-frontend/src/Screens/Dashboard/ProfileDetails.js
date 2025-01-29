import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import PromptBox from '../PromptBox/Prompt';
import {
  deleteProfileImage,
  logout,
  removeUserDeviceToken,
  updateUser,
  updateUserProfile,
} from '../../Redux/Slices/authslice';
import {useDispatch, useSelector} from 'react-redux';
import useFetchUserFromStorage from '../../Redux/hooks/useFetchUserFromStorage';
import Toast from 'react-native-toast-message';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {m} from 'walstar-rn-responsive';

// Helper function to display Toast messages
const showToast = (type, message) => {
  Toast.show({
    type,
    position: 'top',
    text1: message,
  });
};

const ProfileDetails = ({route, navigation}) => {
  const dispatch = useDispatch();
  const profileData = useSelector(state => state.auth.user);
  const isLoading = useSelector(state => state.auth.loading);

  useFetchUserFromStorage();

  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const [isDeleteImagePromptVisible, setIsDeleteImagePromptVisible] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editedData, setEditedData] = useState({
    userName: profileData?.userName,
    mobileNo: profileData?.mobileNo,
    email: profileData?.email,
    address: profileData?.address,
  });

  const toggleEditMode = () => setIsEditing(prevState => !prevState);

  const handleProfileImage = action => {
    const options =
      action === 'camera'
        ? {
            mediaType: 'photo',
            cameraType: 'front',
            quality: 1,
            saveToPhotos: true,
          }
        : {mediaType: 'photo', quality: 1};
    const launch = action === 'camera' ? launchCamera : launchImageLibrary;
    launch(options, response => handleImageResponse(response));
  };

  const handleImageResponse = async response => {
    if (response.didCancel || response.errorCode)
      return showToast(
        'error',
        response.errorMessage || 'Something went wrong.',
      );
    try {
      setLoading(true);
      const {uri, type, fileName} = response.assets[0];
      const formData = new FormData();
      formData.append('profileImage', {
        uri,
        type,
        name: fileName || 'profile_image.jpg',
      });
      await dispatch(updateUserProfile(formData)).unwrap();
      setLoading(false);
      showToast('success', 'Profile Image Updated Successfully');
    } catch (error) {
      setLoading(false);
      showToast('error', error.message || 'Profile Update Failed');
    }
  };

  const handleLogout = () => setIsPromptVisible(true);

  const handleConfirmLogout = async () => {
    try {
      await dispatch(removeUserDeviceToken({}));
      dispatch(logout());
      setTimeout(() => {
        setIsPromptVisible(false);
        navigation.replace('Login');
      }, 200);
    } catch (error) {
      console.error('Error during logout process:', error);
    }
  };

  const handleDeleteProfileImage = () => setIsDeleteImagePromptVisible(true);

  const handleConfirmDeleteImage = async () => {
    try {
      await dispatch(deleteProfileImage()).unwrap();
      showToast('success', 'Profile image deleted successfully');
      setIsDeleteImagePromptVisible(false);
    } catch (error) {
      showToast('error', error?.message || 'Failed to delete profile image');
      setIsDeleteImagePromptVisible(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await dispatch(updateUser(editedData)).unwrap();
      setIsEditing(false);
      showToast('success', response.messsage || 'Profile Edited Successfully');
    } catch (error) {
      showToast('error', error?.message || 'Profile Edit Failed');
    }
  };

  const renderProfileField = (
    iconName,
    label,
    value,
    isEditable = false,
    fieldKey,
  ) => (
    <View style={styles.row}>
      <Icon name={iconName} size={28} color="#b80266" style={styles.icon} />
      <View style={styles.dataContainer}>
        <Text style={styles.detailLabel}>{label}</Text>
        {isEditable ? (
          <TextInput
            style={styles.input}
            value={editedData[fieldKey]}
            onChangeText={text =>
              setEditedData({...editedData, [fieldKey]: text})
            }
          />
        ) : (
          <Text style={styles.detailText}>{value}</Text>
        )}
      </View>
    </View>
  );

  return (
    <>
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Personal Details</Text>
        <TouchableOpacity onPress={toggleEditMode} style={styles.editIcon}>
          <Icon name="edit" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.profileInfo}>
          <TouchableOpacity onPress={() => handleProfileImage('gallery')}>
            <View style={styles.profileImageContainer}>
              {profileData?.profileImage ? (
                <Image
                  source={{uri: profileData.profileImage}}
                  style={styles.profileImage}
                />
              ) : (
                <Icon name="user" size={50} color="#b80266" />
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.detailTextName}>{profileData?.userName}</Text>

          {profileData?.profileImage && (
            <TouchableOpacity
              style={styles.deleteImageButton}
              onPress={handleDeleteProfileImage}>
              <Icon name="trash" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {(isLoading || loading) && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#b80266" />
          </View>
        )}

        {renderProfileField(
          'user',
          'Name',
          profileData?.userName,
          isEditing,
          'userName',
        )}
        <View style={styles.hrLine} />
        {renderProfileField(
          'phone',
          'Phone',
          profileData?.mobileNo,
          isEditing,
          'mobileNo',
        )}
        <View style={styles.hrLine} />
        {renderProfileField(
          'message-square',
          'Email',
          profileData?.email,
          isEditing,
          'email',
        )}
        <View style={styles.hrLine} />
        {renderProfileField(
          'credit-card',
          'Aadhar Card No',
          profileData?.aadharCardNo,
        )}
        <View style={styles.hrLine} />
        {renderProfileField(
          'map-pin',
          'Address',
          profileData?.address,
          isEditing,
          'address',
        )}
        <View style={styles.hrLine} />

        {isEditing && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleSaveChanges}>
            <Text style={styles.editButtonText}>Save</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.option, styles.bottomLogout]}
          onPress={handleLogout}>
          <Icon name="log-out" size={28} color="#b80266" />
          <Text style={styles.optionText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <PromptBox
        visible={isPromptVisible}
        message="Are you sure you want to logout?"
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsPromptVisible(false)}
      />
      <PromptBox
        visible={isDeleteImagePromptVisible}
        message="Are you sure you want to delete your profile image?"
        onConfirm={handleConfirmDeleteImage}
        onCancel={() => setIsDeleteImagePromptVisible(false)}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: m(100),
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
    elevation: m(5),
    marginHorizontal: m(16),
  },
  profileImageContainer: {
    marginBottom: m(10),
    borderRadius: m(50),
    overflow: 'hidden',
    width: m(100),
    height: m(100),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: m(2),
    borderColor: '#fff',
    position: 'relative',
  },
  profileImage: {
    width: m(100),
    height: m(100),
    borderRadius: m(50),
  },
  profileIcon: {
    backgroundColor: '#FFA36C',
    padding: m(15),
    borderRadius: m(40),
  },
  deleteImageButton: {
    position: 'absolute',
    top: m(6),
    right: m(6),
    backgroundColor: '#b80266',
    borderRadius: m(15),
    padding: m(5),
  },
  editIcon: {
    position: 'absolute',
    right: m(20),
    top: m(30),
  },
  input: {
    height: m(40),
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: m(8),
    paddingHorizontal: m(15),
    marginTop: m(5),
  },
  editButton: {
    paddingVertical: m(10),
    backgroundColor: '#b80266',
    borderRadius: m(8),
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: m(18),
    color: '#fff',
    fontWeight: 'bold',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: m(10),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  optionText: {
    fontSize: m(16),
    fontWeight: '700',
    color: '#b80266',
    marginLeft: m(18),
  },
  hrLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: m(10),
  },
  headerBar: {
    backgroundColor: '#b80266',
    height: m(70),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: m(10),
    borderBottomEndRadius: m(30),
    borderBottomStartRadius: m(30),
    elevation: m(5),
  },
  backButton: {
    position: 'absolute',
    left: m(15),
    top: m(15),
    padding: m(10),
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: m(20),
    fontFamily: 'Montserrat-Bold',
  },
  detailTextName: {
    fontSize: m(20),
    fontFamily: 'Poppins-Bold',
    color: 'white',
    textAlign: 'center',
  },
  detailLabel: {
    fontSize: m(16),
    fontWeight: '700',
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  detailText: {
    fontSize: m(16),
    fontFamily: 'Poppins-Regular',
    color: '#333333',
    paddingBlock: m(3),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: m(5),
    width: '100%',
  },
  icon: {
    marginRight: m(10),
    marginBottom: m(8),
  },
  dataContainer: {
    marginLeft: m(10),
    width: '86%',
  },
  bottomLogout: {
    marginBottom: m(40),
  },
});

export default ProfileDetails;
