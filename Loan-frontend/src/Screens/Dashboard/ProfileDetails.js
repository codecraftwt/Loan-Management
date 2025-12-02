import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {useDispatch, useSelector} from 'react-redux';
import {m} from 'walstar-rn-responsive';
import Header from '../../Components/Header';
import PromptBox from '../PromptBox/Prompt';
import {
  deleteProfileImage,
  logout,
  removeUserDeviceToken,
  updateUser,
  updateUserProfile,
} from '../../Redux/Slices/authslice';
import useFetchUserFromStorage from '../../Redux/hooks/useFetchUserFromStorage';

const ProfileDetails = ({navigation}) => {
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

  const toggleEditMode = () => setIsEditing(prev => !prev);

  // Profile Image Functions
  const handleProfileImage = action => {
    const options =
      action === 'camera'
        ? {mediaType: 'photo', cameraType: 'front', quality: 1, saveToPhotos: true}
        : {mediaType: 'photo', quality: 1};

    const launch = action === 'camera' ? launchCamera : launchImageLibrary;
    launch(options, response => {
      if (response.didCancel || response.errorCode)
        return Toast.show({type: 'error', text1: 'Cancelled or Error'});
      handleImageUpload(response.assets[0]);
    });
  };

  const handleImageUpload = async asset => {
    try {
      setLoading(true);
      const {uri, type, fileName} = asset;
      const formData = new FormData();
      formData.append('profileImage', {uri, type, name: fileName || 'profile.jpg'});
      await dispatch(updateUserProfile(formData)).unwrap();
      setLoading(false);
      Toast.show({type: 'success', text1: 'Profile Updated Successfully'});
    } catch (err) {
      setLoading(false);
      Toast.show({type: 'error', text1: 'Profile Update Failed'});
    }
  };

  const handleLogout = () => setIsPromptVisible(true);
  const handleConfirmLogout = async () => {
    await dispatch(removeUserDeviceToken());
    dispatch(logout());
    navigation.replace('Login');
  };

  const handleDeleteProfileImage = () => setIsDeleteImagePromptVisible(true);
  const handleConfirmDeleteImage = async () => {
    try {
      await dispatch(deleteProfileImage()).unwrap();
      Toast.show({type: 'success', text1: 'Profile Image Deleted'});
      setIsDeleteImagePromptVisible(false);
    } catch (err) {
      Toast.show({type: 'error', text1: 'Delete Failed'});
      setIsDeleteImagePromptVisible(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      await dispatch(updateUser(editedData)).unwrap();
      setIsEditing(false);
      Toast.show({type: 'success', text1: 'Profile Updated'});
    } catch (err) {
      Toast.show({type: 'error', text1: 'Update Failed'});
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const renderField = (icon, label, value, editable = false, keyName) => (
    <View style={styles.fieldRow}>
      <Icon name={icon} size={22} color="#ff6700" />
      <View style={{flex: 1, marginLeft: m(10)}}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {editable ? (
          <TextInput
            style={styles.fieldInput}
            value={editedData[keyName]}
            onChangeText={text => setEditedData({...editedData, [keyName]: text})}
          />
        ) : (
          <Text style={styles.fieldValue}>{value || '-'}</Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#f9f9f9'}}>
      <Header
        title="Profile Details"
        showBackButton
        isEdit={true}
        onEditPress={toggleEditMode}
      />

      <ScrollView contentContainerStyle={{padding: m(20)}}>
        {/* Profile Card */}
        <LinearGradient
          colors={['#fff', '#fff']}
          style={styles.profileCard}>
          <View style={styles.imageContainer}>
            {profileData?.profileImage ? (
              <Image
                source={{uri: profileData.profileImage}}
                style={styles.profileImage}
              />
            ) : (
              <Icon name="user" size={60} color="#ff6700" />
            )}

            {/* Camera Icon Overlay */}
            <TouchableOpacity
              style={styles.cameraBtn}
              onPress={() => handleProfileImage('gallery')}
            >
              <LinearGradient
                colors={['#ff6700', '#ff9100']}
                style={styles.cameraIconBg}
              >
                <Icon name="camera" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>

            {/* Delete Image */}
            {profileData?.profileImage && (
              <TouchableOpacity
                style={styles.deleteImageBtn}
                onPress={handleDeleteProfileImage}
              >
                <Icon name="trash" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.userName}>{profileData?.userName}</Text>
        </LinearGradient>

        {loading && <ActivityIndicator size="large" color="#ff6700" style={{marginTop: m(20)}} />}

        {/* Profile Fields */}
        <View style={{marginTop: m(20)}}>
          {renderField('user', 'Name', profileData?.userName, isEditing, 'userName')}
          {renderField('phone', 'Phone', profileData?.mobileNo, isEditing, 'mobileNo')}
          {renderField('message-square', 'Email', profileData?.email, isEditing, 'email')}
          {renderField('map-pin', 'Address', profileData?.address, isEditing, 'address')}
        </View>

        {isEditing && (
          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveChanges}>
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        )}

        {/* Cancel Button */}
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
          <Icon name="x" size={22} color="#ff6700" />
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Prompt Boxes */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    alignItems: 'center',
    paddingVertical: m(20),
    borderRadius: m(16),
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: m(4)},
    shadowOpacity: 0.1,
    shadowRadius: m(8),
    elevation: 5,
  },
  imageContainer: {
    width: m(110),
    height: m(110),
    borderRadius: m(55),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    position: 'relative',
    borderColor: 'lightgrey',
    borderWidth: 1
  },
  profileImage: {
    width: m(110),
    height: m(110),
    borderRadius: m(55),
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: m(35),
    height: m(35),
    borderRadius: m(17.5),
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  cameraIconBg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: m(17.5),
  },
  deleteImageBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#ff6700',
    padding: 6,
    borderRadius: 20,
  },
  userName: {
    fontSize: m(20),
    fontWeight: 'bold',
    color: '#333',
    marginTop: m(10),
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: m(15),
    backgroundColor: '#fff',
    padding: m(12),
    borderRadius: m(12),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: m(2)},
    shadowOpacity: 0.05,
    shadowRadius: m(4),
    elevation: 2,
  },
  fieldLabel: {
    fontSize: m(14),
    color: '#777',
  },
  fieldValue: {
    fontSize: m(16),
    fontWeight: '500',
    color: '#333',
    marginTop: 3,
  },
  fieldInput: {
    fontSize: m(16),
    borderBottomWidth: 1,
    borderBottomColor: '#ff6700',
    color: '#333',
    paddingVertical: 2,
    marginTop: 3,
  },
  saveBtn: {
    backgroundColor: '#ff6700',
    paddingVertical: m(12),
    borderRadius: m(12),
    alignItems: 'center',
    marginTop: m(20),
  },
  saveBtnText: {
    color: '#fff',
    fontSize: m(16),
    fontWeight: 'bold',
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#ff6700',
    borderWidth: 1,
    paddingVertical: m(10),
    borderRadius: m(12),
    marginTop: m(30),
  },
  cancelText: {
    color: '#ff6700',
    fontSize: m(16),
    fontWeight: 'bold',
    marginLeft: m(8),
  },
});

export default ProfileDetails;