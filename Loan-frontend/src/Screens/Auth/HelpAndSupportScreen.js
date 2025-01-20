import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Button,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {m} from 'walstar-rn-responsive';

export default function HelpAndSupportScreen() {
  const navigation = useNavigation();
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      // Simulate sending a message (could be to an API or email)
      console.log('Message sent:', message);
      setMessage('');
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Your message has been sent successfully!',
      });
    } else {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Please enter a message before sending.',
      });
    }
  };

  return (
    <>
      {/* Header Bar with Back Button */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Help & Support</Text>
      </View>

      {/* Help & Support Content */}
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Q: How do I reset my password?</Text>
          <Text style={styles.faqAnswer}>
            A: Go to Settings - Account - Reset Password.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Q: How can I contact support?</Text>
          <Text style={styles.faqAnswer}>
            A: You can contact us through the form below or email us at
            support@loanhub.com.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Troubleshooting Tips</Text>
        <Text style={styles.tip}>
          1. Make sure your internet connection is stable.
        </Text>
        <Text style={styles.tip}>
          2. Restart the app if you experience any crashes.
        </Text>
        <Text style={styles.tip}>
          3. Update your app to the latest version from the App Store or Google
          Play.
        </Text>

        <Text style={styles.sectionTitle}>Contact Support</Text>
        <Text style={styles.sectionDescription}>
          If you need assistance or have any questions, feel free to contact our
          support team.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Type your message here..."
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={handleSendMessage}>
          <Text style={styles.subscribeButtonText}>Send Message</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Useful Links</Text>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              'https://github.com/codecraftwt/Loan-Management-App-New',
            )
          }>
          <Text style={styles.link}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              'https://github.com/codecraftwt/Loan-Management-App-New',
            )
          }>
          <Text style={styles.link}>Terms of Service</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: m(20),
    backgroundColor: '#f5f5f5',
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
    color: '#FFF',
    fontSize: m(20),
    fontFamily: 'Montserrat-Bold',
  },
  sectionTitle: {
    fontSize: m(18),
    fontWeight: 'bold',
    color: '#333',
    marginBlock: m(10),
  },
  sectionDescription: {
    fontSize: m(16),
    color: '#555',
    marginBottom: m(10),
  },
  faqItem: {
    marginBottom: m(10),
  },
  faqQuestion: {
    fontSize: m(16),
    fontWeight: '600',
    color: '#333',
  },
  faqAnswer: {
    fontSize: m(16),
    color: '#555',
    marginLeft: m(10),
  },
  tip: {
    fontSize: m(16),
    color: '#555',
    marginLeft: m(10),
  },
  input: {
    height: m(100),
    borderColor: '#ddd',
    borderWidth: m(1),
    borderRadius: m(8),
    padding: m(10),
    fontSize: m(16),
    marginBottom: m(15),
  },
  link: {
    fontSize: m(16),
    color: '#b80266',
    textDecorationLine: 'underline',
    marginBottom: m(10),
  },
  subscribeButton: {
    backgroundColor: '#b80266',
    borderRadius: m(8),
    paddingVertical: m(12),
    alignItems: 'center',
    width: '100%',
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: m(16),
    fontWeight: 'bold',
  },
});
