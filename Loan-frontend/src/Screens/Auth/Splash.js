import React, {useEffect} from 'react';
import {View, Text, Image, StyleSheet, StatusBar} from 'react-native';
import {logo} from '../../Assets';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setUser} from '../../Redux/Slices/authslice';
import {m} from 'walstar-rn-responsive';

export default function SplashScreen({navigation}) {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const user = await AsyncStorage.getItem('user');
          if (user) {
            dispatch(setUser(JSON.parse(user)));
          }
          // Navigate to the home screen
          navigation.replace('BottomNavigation');
        } else {
          // Token not found, user is not logged in, navigate to login screen
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        navigation.replace('Login');
      }
    };

    setTimeout(() => {
      checkLoginStatus();
    }, 2000);
  }, [dispatch, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#b80266" />
      <Image resizeMode="contain" style={styles.logo} source={logo} />
      <Text style={styles.welcomeText}>Manage Your Loans </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b80266',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: m(300),
    height: m(200),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: m(20),
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
  },
});
