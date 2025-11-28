// Header.js
import React from 'react';
import {View, Text, Image, StyleSheet, StatusBar, Platform} from 'react-native';
import {m} from 'walstar-rn-responsive';
import {logo} from '../Assets';
import colors from '../constants/colors';

const Header = ({title}) => {
  return (
    <>
      <StatusBar barStyle="light-content" {...(Platform.OS === 'android' && {backgroundColor: colors.primary})} />

      <View style={styles.headerBar}>
        <Text style={styles.headerText}>{title}</Text>
        <Image source={logo} style={styles.logo} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerBar: {
    height: m(70),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: m(10),
    borderBottomEndRadius: m(30),
    borderBottomStartRadius: m(30),    
    elevation: m(5),
    position: 'relative',
  },
  headerText: {
    color: '#fff',
    fontSize: m(20),
    fontFamily: 'Montserrat-Bold',
    letterSpacing: m(1),
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  logo: {
    width: m(80),
    height: m(40),
    position: 'absolute',
    right: 0,
    top: m(15),
  },
});

export default Header;
