import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

// Subscription Screen Component
const SubscriptionScreen = ({navigation}) => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Function to handle plan selection
  const handleSubscription = plan => {
    setSelectedPlan(plan);
  };

  const handleProceedToPayment = () => {
    // Show an alert message when the user proceeds to payment
    Alert.alert(
      'Payment Information',
      'Currently all services are free, no need to choose a plan or subscribe.',
      [{text: 'OK', onPress: () => navigation.goBack()}],
      {cancelable: false},
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()} // Using navigation prop to go back
          >
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Subscription</Text>
        </View>

        {/* Subscription Plan Selection */}
        <View style={styles.container}>
          <Text style={styles.title}>Choose Your Plan</Text>
          <Text style={styles.subtitle}>
            Select a plan to proceed with the subscription and enjoy premium
            features.
          </Text>

          {/* Monthly Plan Button */}
          <TouchableOpacity
            style={[
              styles.button,
              selectedPlan === 'Monthly' && styles.selectedButton,
            ]}
            onPress={() => handleSubscription('Monthly')}>
            <Text
              style={[
                styles.buttonText,
                selectedPlan === 'Monthly' && styles.selectedButtonText,
              ]}>
              Monthly Plan - ₹399
            </Text>
          </TouchableOpacity>

          {/* Yearly Plan Button */}
          <TouchableOpacity
            style={[
              styles.button,
              selectedPlan === 'Yearly' && styles.selectedButton,
            ]}
            onPress={() => handleSubscription('Yearly')}>
            <Text
              style={[
                styles.buttonText,
                selectedPlan === 'Yearly' && styles.selectedButtonText,
              ]}>
              Yearly Plan - ₹2999
            </Text>
          </TouchableOpacity>

          {/* Proceed Button */}
          {selectedPlan && (
            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={handleProceedToPayment}>
              <Text style={styles.subscribeButtonText}>Proceed to Payment</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles for the Subscription Screen
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBar: {
    backgroundColor: '#b80266',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    elevation: 5,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'Montserrat-Bold',
    letterSpacing: 1,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 18,
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 24,
  },
  button: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 10,
    marginBottom: 16,
    width: '90%',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  selectedButtonText: {
    color: '#fff', // White text for the selected button
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  subscribeButton: {
    backgroundColor: '#b80266',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    width: '90%',
    marginTop: 20,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default SubscriptionScreen;
