// Header.js
import React from 'react';
import {View, Text, Image, StyleSheet, StatusBar} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {m} from 'walstar-rn-responsive';
import {logo} from '../Assets';

const Header = ({title}) => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Custom Gradient Status Bar */}
      <LinearGradient
       colors={['#ff6700', '#ff7900', '#ff8500', '#ff9100',]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.gradientStatusBar}
      >
        <View style={styles.statusBarContent} />
      </LinearGradient>

      {/* Main Header */}
      <LinearGradient
         colors={['#ff6700', '#ff7900', '#ff8500', '#ff9100',]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.headerBar}
      >
        <Text style={styles.headerText}>{title}</Text>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
          <View style={styles.glowEffect} />
        </View>
        </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  gradientStatusBar: {
    height: StatusBar.currentHeight,
    width: '100%',
    // elevation: m(10),
    // shadowColor: '#6e22b4',
    // shadowOffset: {width: 0, height: m(2)},
    // shadowOpacity: 0.6,
    // shadowRadius: m(5),
  },
  statusBarContent: {
    flex: 1,
  },
  headerBar: {
    height: m(85),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: m(20),
    borderBottomEndRadius: m(25),
    borderBottomStartRadius: m(25),
    // elevation: m(15),
    // shadowColor: '#ff7900',
    // shadowOffset: {width: 0, height: m(8)},
    // shadowOpacity: 0.4,
    // shadowRadius: m(10),
    position: 'relative',
    overflow: 'hidden',
    marginTop: -1,
  },
  headerText: {
    color: '#ffffff',
    fontSize: m(20),
    fontFamily: 'Montserrat-Bold',
    letterSpacing: m(1.2),
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: m(8),
    marginBottom: 20
  },
  logoContainer: {
    position: 'absolute',
    right: m(25),
    top: m(25),
    alignItems: 'center',
    zIndex: 2,
  },
  logo: {
    width: m(65),
    height: m(32),
    resizeMode: 'contain',
    tintColor: '#ffffff',
  },
  glowEffect: {
    position: 'absolute',
    width: m(50),
    height: m(50),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: m(25),
    top: m(-10),
    right: m(-10),
    zIndex: -1,
  },
});

export default Header;
