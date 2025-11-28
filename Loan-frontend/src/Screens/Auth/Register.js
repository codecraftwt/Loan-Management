import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch} from 'react-redux';
import {registerUser} from '../../Redux/Slices/authslice';
import Toast from 'react-native-toast-message';
import {m} from 'walstar-rn-responsive';

export default function Register({navigation}) {
  const [name, setName] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [nameError, setNameError] = useState('');
  const [aadharError, setAadharError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const dispatch = useDispatch();

  const validateName = text => {
    setName(text);
    if (text.length < 1) {
      setNameError('Name is required.');
    } else {
      setNameError('');
    }
  };

  const validateAadhar = text => {
    const numericText = text.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (numericText.length <= 12) {
      setAadharNumber(numericText);
      setAadharError(
        numericText.length < 12 ? 'Aadhar number must be 12 digits.' : '',
      );
    }
  };

  const validateMobile = text => {
    const numericText = text.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (numericText.length <= 10) {
      setMobileNumber(numericText);
      setMobileError(
        numericText.length < 10 ? 'Mobile number must be 10 digits.' : '',
      );
    }
  };

  const validateEmail = text => {
    setEmail(text);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(text)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const validateAddress = text => {
    setAddress(text);
    if (text.length < 1) {
      setAddressError('Address is required.');
    } else {
      setAddressError('');
    }
  };

  const validatePassword = text => {
    setPassword(text);
    if (text.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
    } else if (confirmPassword && text !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
    } else {
      setPasswordError('');
      if (confirmPassword && text === confirmPassword) {
        setConfirmPasswordError('');
      }
    }
  };

  const validateConfirmPassword = text => {
    setConfirmPassword(text);
    if (text !== password) {
      setConfirmPasswordError('Passwords do not match.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const isFormValid = () => {
    return (
      name &&
      aadharNumber.length === 12 &&
      mobileNumber.length === 10 &&
      email &&
      address &&
      password.length >= 6 &&
      password === confirmPassword
    );
  };

  const handleRegister = async () => {
    if (isFormValid()) {
      const payload = {
        userName: name,
        aadharCardNo: aadharNumber,
        mobileNo: mobileNumber,
        email: email,
        address: address,
        password: password,
      };

      try {
        console.log(payload, '<-------- payload');
        // Dispatch the registration action
        await dispatch(registerUser(payload))
          .unwrap() // Automatically resolves on success or throws on failure
          .then(response => {
            // On success, show a success toast and navigate to BottomNavigation
            Toast.show({
              type: 'success',
              position: 'top',
              text1: 'User registered successfully',
            });
            navigation.navigate('BottomNavigation');
          });

        // Navigate to Login screen after successful registration
        navigation.navigate('Login');
      } catch (error) {
        console.log(error, 'Error while creating user');
        Toast.show({
          type: 'error',
          position: 'top',
          text1: error.message || 'Please try again.',
        });
      }
    } else {
      Alert.alert('Invalid Form', 'Please fill in all fields correctly.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" {...(Platform.OS === 'android' && {backgroundColor: '#fff'})} />
      <Text style={styles.welcomeText}>Create an Account</Text>
      <Text style={styles.headerText}>Register to LoanHub</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#666666"
          value={name}
          onChangeText={validateName}
        />
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Aadhar Card Number"
          keyboardType="numeric"
          placeholderTextColor="#666666"
          value={aadharNumber}
          onChangeText={validateAadhar}
        />
        {aadharError ? (
          <Text style={styles.errorText}>{aadharError}</Text>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          keyboardType="phone-pad"
          placeholderTextColor="#666666"
          value={mobileNumber}
          onChangeText={validateMobile}
        />
        {mobileError ? (
          <Text style={styles.errorText}>{mobileError}</Text>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          keyboardType="email-address"
          placeholderTextColor="#666666"
          value={email}
          onChangeText={validateEmail}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Address"
          placeholderTextColor="#666666"
          value={address}
          onChangeText={validateAddress}
        />
        {addressError ? (
          <Text style={styles.errorText}>{addressError}</Text>
        ) : null}

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            placeholderTextColor="#666666"
            value={password}
            onChangeText={validatePassword}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}>
            <Ionicons
              name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={25}
              color={'#f26fb7'}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            secureTextEntry={!confirmPasswordVisible}
            placeholderTextColor="#666666"
            value={confirmPassword}
            onChangeText={validateConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
            <Ionicons
              name={confirmPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={25}
              color={'#f26fb7'}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        {confirmPasswordError ? (
          <Text style={styles.errorText}>{confirmPasswordError}</Text>
        ) : null}
      </View>

      <TouchableOpacity
        style={[styles.registerButton, {opacity: isFormValid() ? 1 : 0.5}]}
        onPress={handleRegister}
        disabled={!isFormValid()}>
        <Text style={styles.registerButtonText}>Create Account</Text>
      </TouchableOpacity>

      <View style={styles.linksContainer}>
        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
          Already have an account? Login
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: m(20),
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: m(22),
    color: '#b80266',
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    marginBottom: m(20),
  },
  headerText: {
    fontSize: m(18),
    color: '#333',
    fontFamily: 'Montserrat-Bold',
    marginBottom: m(40),
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: m(30),
  },
  input: {
    height: m(50),
    borderColor: '#f26fb7',
    borderWidth: m(1),
    borderRadius: m(8),
    marginBottom: m(15),
    paddingHorizontal: m(16),
    fontSize: m(14),
    fontFamily: 'Poppins-Regular',
    color: '#333333',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: m(2)},
    shadowOpacity: 0.1,
    shadowRadius: m(4),
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#f26fb7',
    borderWidth: m(1),
    borderRadius: m(8),
    height: m(50),
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: m(2)},
    shadowOpacity: 0.1,
    shadowRadius: m(4),
    marginBottom: m(15),
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: m(16),
    fontSize: m(14),
    fontFamily: 'Poppins-Regular',
    color: '#333333',
  },
  icon: {
    paddingHorizontal: m(10),
  },
  registerButton: {
    backgroundColor: '#b80266',
    borderRadius: m(8),
    height: m(50),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: m(4),
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: m(16),
    fontFamily: 'Poppins-Bold',
  },
  linksContainer: {
    alignItems: 'center',
    marginTop: m(10),
  },
  link: {
    color: '#b80266',
    fontSize: m(14),
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginTop: m(5),
  },
  errorText: {
    color: 'red',
    fontSize: m(12),
    fontFamily: 'Poppins-Regular',
    marginTop: m(-10),
    marginBottom: m(10),
  },
});
