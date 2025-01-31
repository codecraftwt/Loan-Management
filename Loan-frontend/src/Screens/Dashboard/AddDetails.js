import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useDispatch, useSelector} from 'react-redux';
import {
  createLoan,
  getLoanByAadhar,
  updateLoan,
} from '../../Redux/Slices/loanSlice';
import Toast from 'react-native-toast-message';
import colors from '../../constants/colors';
import {m} from 'walstar-rn-responsive';

export default function AddDetails({route, navigation}) {
  const dispatch = useDispatch();
  const {loans, error, aadharError, loading} = useSelector(
    state => state.loans,
  );
  const {loanDetails} = route.params || {};

  // State variables
  const [formData, setFormData] = useState({
    name: loanDetails?.name || '',
    mobileNumber: loanDetails?.mobileNumber || '',
    aadhaarNumber: loanDetails?.aadhaarNumber || '',
    address: loanDetails?.address || '',
    amount: loanDetails?.amount?.toString() || '',
    loanStartDate: loanDetails?.loanStartDate || null,
    loanEndDate: loanDetails?.loanEndDate || null,
    purpose: loanDetails?.purpose || '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showOldHistoryButton, setShowOldHistoryButton] = useState(false);
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    const userProfileImage = loans[0]?.userProfileImage;
    setProfileImage(userProfileImage);
  }, [loans, formData.aadhaarNumber]);

  // Validate form fields
  const validateForm = () => {
    const {
      name,
      mobileNumber,
      aadhaarNumber,
      address,
      amount,
      loanStartDate,
      loanEndDate,
      purpose,
    } = formData;

    if (
      !name ||
      !mobileNumber ||
      !aadhaarNumber ||
      !address ||
      !amount ||
      !loanStartDate ||
      !loanEndDate ||
      !purpose
    ) {
      setErrorMessage('All fields are required.');
      return false;
    }
    if (isNaN(amount) || parseFloat(amount) <= 0) {
      setErrorMessage('Amount should be a positive number.');
      return false;
    }
    if (loanStartDate >= loanEndDate) {
      setErrorMessage('Loan start date must be before loan end date.');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (!validateForm()) return;

    const newData = {
      ...formData,
      amount: parseFloat(formData.amount),
      profileImage,
    };

    try {
      const action = loanDetails
        ? updateLoan({...newData, id: loanDetails._id})
        : createLoan(newData);
      const response = await dispatch(action);

      if (
        createLoan.fulfilled.match(response) ||
        updateLoan.fulfilled.match(response)
      ) {
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Loan saved successfully',
        });
        navigation.navigate('BottomNavigation', {screen: 'Outward'});
      } else {
        setErrorMessage(
          response.payload?.errors?.join(', ') || 'An error occurred.',
        );
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      setErrorMessage('An error occurred while saving the loan.');
    }
  };

  // Reset form fields
  const resetForm = () => {
    setFormData({
      name: '',
      mobileNumber: '',
      aadhaarNumber: '',
      address: '',
      amount: '',
      loanStartDate: null,
      loanEndDate: null,
      purpose: '',
    });
    setErrorMessage('');
    setShowOldHistoryButton(false);
  };

  // Handle Aadhar number change
  const handleAadharChange = text => {
    if (!/^\d{0,12}$/.test(text)) return;
    setFormData({...formData, aadhaarNumber: text});
    setShowOldHistoryButton(text.length === 12);
    if (text.length === 12) dispatch(getLoanByAadhar(text));
  };

  // Handle contact number change
  const handleContactNoChange = text => {
    if (/^[0-9]{0,10}$/.test(text)) {
      setFormData({...formData, mobileNumber: text});
    }
  };

  // Handle date picker changes
  const handleDateChange = (type, date) => {
    setFormData({...formData, [type]: date});
    if (type === 'loanStartDate') setStartDatePickerVisible(false);
    else setEndDatePickerVisible(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 20}>
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerText}>
            {loanDetails ? 'Edit Loan Details' : 'Add Loan Details'}
          </Text>
        </View>
        <ScrollView
          style={styles.scrollViewContainer}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.msgText}>
            Fill the below form to {loanDetails ? 'update' : 'add'} loan
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={formData.name}
            onChangeText={text => setFormData({...formData, name: text})}
            placeholderTextColor="#888"
          />

          <TextInput
            style={styles.input}
            placeholder="Contact Number"
            value={formData.mobileNumber}
            onChangeText={handleContactNoChange}
            keyboardType="numeric"
            placeholderTextColor="#888"
          />

          <TextInput
            style={styles.input}
            placeholder="Aadhar Card No"
            value={formData.aadhaarNumber}
            onChangeText={handleAadharChange}
            keyboardType="numeric"
            placeholderTextColor="#888"
          />

          {showOldHistoryButton &&
            (aadharError ? (
              <Text style={styles.aadharText}>
                {aadharError.message || 'Aadhar number not found'}
              </Text>
            ) : (
              <TouchableOpacity
                style={styles.oldHistoryButton}
                onPress={() =>
                  navigation.navigate('OldHistoryPage', {
                    aadharNo: formData.aadhaarNumber,
                  })
                }>
                <Text style={styles.oldHistoryButtonText}>Old History</Text>
              </TouchableOpacity>
            ))}

          <TextInput
            style={styles.textArea}
            placeholder="Address"
            value={formData.address}
            onChangeText={text => setFormData({...formData, address: text})}
            multiline
            placeholderTextColor="#888"
          />

          <View style={styles.loanAmountWrapper}>
            <TextInput
              style={styles.loanAmountInput}
              placeholder="Amount"
              value={formData.amount}
              onChangeText={text => setFormData({...formData, amount: text})}
              keyboardType="numeric"
              placeholderTextColor="#888"
            />
            <Text style={styles.rsText}>Rs</Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              setStartDatePickerVisible(true);
            }}>
            <TextInput
              style={styles.input}
              placeholder="Loan Start Date"
              value={
                formData.loanStartDate
                  ? new Date(formData.loanStartDate).toLocaleDateString()
                  : ''
              }
              editable={false}
              placeholderTextColor="#888"
            />
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="date"
            onConfirm={date => handleDateChange('loanStartDate', date)}
            onCancel={() => setStartDatePickerVisible(false)}
            minimumDate={new Date()}
          />

          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              setEndDatePickerVisible(true);
            }}>
            <TextInput
              style={styles.input}
              placeholder="Loan End Date"
              value={
                formData.loanEndDate
                  ? new Date(formData.loanEndDate).toLocaleDateString()
                  : ''
              }
              editable={false}
              placeholderTextColor="#888"
            />
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="date"
            onConfirm={date => handleDateChange('loanEndDate', date)}
            onCancel={() => setEndDatePickerVisible(false)}
            minimumDate={new Date()}
          />

          <TextInput
            style={styles.textArea}
            placeholder="Purpose"
            value={formData.purpose}
            onChangeText={text => setFormData({...formData, purpose: text})}
            multiline
            placeholderTextColor="#888"
          />

          {(errorMessage || error) && (
            <Text style={styles.errorText}>
              {errorMessage || error?.message || 'An unknown error occurred.'}
            </Text>
          )}

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleSubmit}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>
                  {loanDetails ? 'Update' : 'Add'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  headerBar: {
    backgroundColor: colors.primary,
    height: m(70),
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: m(10),
    paddingHorizontal: m(20),
    borderBottomEndRadius: m(30),
    borderBottomStartRadius: m(30),
    elevation: m(5),
  },
  backButton: {
    marginRight: m(10),
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: m(20),
    fontFamily: 'Montserrat-Bold',
    flex: 1,
    marginLeft: m(20),
  },
  msgText: {
    color: '#000000',
    fontSize: m(16),
    fontFamily: 'Montserrat-Regular',
    marginBottom: m(20),
  },
  scrollViewContainer: {
    marginTop: m(20),
    marginBottom: m(20),
    paddingHorizontal: m(20),
  },
  input: {
    height: m(42),
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: m(12),
    paddingLeft: m(12),
    borderRadius: m(10),
    fontSize: m(15),
    color: '#000',
  },
  textArea: {
    height: m(90),
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: m(15),
    marginBottom: m(10),
    paddingLeft: m(10),
    borderRadius: m(10),
    textAlignVertical: 'top',
    color: '#000',
  },
  loanAmountWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: m(10),
    borderRadius: m(10),
    position: 'relative',
  },
  loanAmountInput: {
    flex: 1,
    height: m(40),
    paddingLeft: m(10),
    fontSize: m(15),
    color: '#000',
  },
  rsText: {
    position: 'absolute',
    right: m(10),
    fontSize: m(16),
    color: '#333',
  },
  addButton: {
    backgroundColor: '#b80266',
    padding: m(15),
    borderRadius: m(5),
    alignItems: 'center',
    flex: 1,
  },
  resetButton: {
    backgroundColor: 'gray',
    padding: m(15),
    borderRadius: m(5),
    alignItems: 'center',
    flex: 1,
    marginLeft: m(10),
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBlock: m(20),
  },
  buttonText: {
    color: '#fff',
    fontSize: m(16),
    fontWeight: 'bold',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: m(16),
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: m(14),
    marginBottom: m(10),
  },
  aadharText: {
    color: '#000000',
    fontSize: m(14),
    fontFamily: 'Montserrat-Regular',
    marginBottom: m(10),
  },
  oldHistoryButton: {
    backgroundColor: '#b80266',
    padding: m(10),
    borderRadius: m(8),
    marginBottom: m(20),
    alignItems: 'center',
  },
  oldHistoryButtonText: {
    color: '#fff',
    fontSize: m(16),
    fontWeight: 'bold',
  },
});
