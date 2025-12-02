
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';
// import { m } from 'walstar-rn-responsive';
// import Header from '../../Components/Header';

// const SubscriptionScreen = ({ navigation }) => {
//   const [selectedPlan, setSelectedPlan] = useState(null);

//   const handleSubscription = plan => {
//     setSelectedPlan(plan);
//   };

//   const handleProceedToPayment = () => {
//     Alert.alert(
//       'Great News! 🎉',
//       'All our services are currently free! No subscription needed to enjoy all premium features.',
//       [
//         { 
//           text: 'Continue for Free', 
//           onPress: () => navigation.goBack(),
//           style: 'default'
//         }
//       ],
//       { cancelable: true },
//     );
//   };

//   const plans = [
//     {
//       id: 'monthly',
//       name: 'Monthly',
//       price: '₹99',
//       period: 'per month',
//       popular: false,
//       features: ['Unlimited loans', 'Priority support', 'Advanced analytics'],
//     },
//     {
//       id: 'yearly',
//       name: 'Yearly',
//       price: '₹899',
//       period: 'per year',
//       popular: true,
//       features: [
//         'All Monthly features',
//         'Save ₹289',
//         'Early access to new features',
//       ],
//     },
//     {
//       id: 'free',
//       name: 'Free Forever',
//       price: '₹0',
//       period: 'forever',
//       popular: false,
//       features: [
//         'Basic loan management',
//         'Standard support',
//         'Essential features',
//       ],
//     },
//   ];

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header title="Subscription Plans" showBackButton />
      
//       <ScrollView 
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}>
        
//         {/* Hero Section */}
//         <View style={styles.heroSection}>
//           <View style={styles.badge}>
//             <Icon name="star" size={16} color="#FFFFFF" />
//             <Text style={styles.badgeText}>Currently Free</Text>
//           </View>
//           <Text style={styles.heroTitle}>Manage Loans, Hassle-Free</Text>
//           <Text style={styles.heroSubtitle}>
//             All features available at no cost. Choose a plan for future updates.
//           </Text>
//         </View>

//         {/* Plan Cards */}
//         <View style={styles.plansContainer}>
//           {plans.map(plan => (
//             <TouchableOpacity
//               key={plan.id}
//               style={[
//                 styles.planCard,
//                 selectedPlan === plan.id && styles.selectedPlanCard,
//                 plan.popular && styles.popularPlanCard,
//               ]}
//               onPress={() => handleSubscription(plan.id)}
//               activeOpacity={0.8}>
              
//               {plan.popular && (
//                 <View style={styles.popularBadge}>
//                   <Text style={styles.popularBadgeText}>Most Popular</Text>
//                 </View>
//               )}

//               <View style={styles.planHeader}>
//                 <Text style={styles.planName}>{plan.name}</Text>
//                 <View style={styles.priceContainer}>
//                   <Text style={styles.price}>{plan.price}</Text>
//                   <Text style={styles.period}>{plan.period}</Text>
//                 </View>
//               </View>

//               <View style={styles.featuresList}>
//                 {plan.features.map((feature, index) => (
//                   <View key={index} style={styles.featureItem}>
//                     <Icon 
//                       name="check" 
//                       size={16} 
//                       color={selectedPlan === plan.id || plan.id === 'free' ? '#10B981' : '#9CA3AF'} 
//                     />
//                     <Text style={styles.featureText}>{feature}</Text>
//                   </View>
//                 ))}
//               </View>

//               {selectedPlan === plan.id && (
//                 <View style={styles.selectedIndicator}>
//                   <Icon name="check-circle" size={20} color="#3B82F6" />
//                   <Text style={styles.selectedText}>Selected</Text>
//                 </View>
//               )}
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Free Info Card */}
//         <View style={styles.freeCard}>
//           <View style={styles.freeCardHeader}>
//             <Icon name="gift" size={24} color="#10B981" />
//             <Text style={styles.freeCardTitle}>Special Offer</Text>
//           </View>
//           <Text style={styles.freeCardText}>
//             We're currently offering all premium features for free! Enjoy unlimited access while we build our community.
//           </Text>
//         </View>

//         {/* Action Buttons */}
//         <View style={styles.actionsContainer}>
//           <TouchableOpacity
//             style={styles.freeButton}
//             onPress={handleProceedToPayment}>
//             <Icon name="play-circle" size={20} color="#FFFFFF" />
//             <Text style={styles.freeButtonText}>Continue with Free Plan</Text>
//           </TouchableOpacity>

//           {selectedPlan && selectedPlan !== 'free' && (
//             <TouchableOpacity
//               style={styles.premiumButton}
//               onPress={handleProceedToPayment}>
//               <Icon name="credit-card" size={20} color="#FFFFFF" />
//               <Text style={styles.premiumButtonText}>Subscribe to {plans.find(p => p.id === selectedPlan)?.name}</Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Benefits Section */}
//         <View style={styles.benefitsSection}>
//           <Text style={styles.benefitsTitle}>What You Get</Text>
//           <View style={styles.benefitsGrid}>
//             <View style={styles.benefitItem}>
//               <View style={styles.benefitIcon}>
//                 <Icon name="shield" size={24} color="#3B82F6" />
//               </View>
//               <Text style={styles.benefitTitle}>Secure</Text>
//               <Text style={styles.benefitDesc}>Bank-level security</Text>
//             </View>
//             <View style={styles.benefitItem}>
//               <View style={styles.benefitIcon}>
//                 <Icon name="zap" size={24} color="#F59E0B" />
//               </View>
//               <Text style={styles.benefitTitle}>Fast</Text>
//               <Text style={styles.benefitDesc}>Instant processing</Text>
//             </View>
//             <View style={styles.benefitItem}>
//               <View style={styles.benefitIcon}>
//                 <Icon name="smartphone" size={24} color="#8B5CF6" />
//               </View>
//               <Text style={styles.benefitTitle}>Mobile</Text>
//               <Text style={styles.benefitDesc}>Anywhere access</Text>
//             </View>
//           </View>
//         </View>

//         {/* FAQ */}
//         <View style={styles.faqSection}>
//           <Text style={styles.faqTitle}>Common Questions</Text>
//           <View style={styles.faqItem}>
//             <Text style={styles.faqQuestion}>Is it really free?</Text>
//             <Text style={styles.faqAnswer}>
//               Yes! All features are completely free during our launch period.
//             </Text>
//           </View>
//           <View style={styles.faqItem}>
//             <Text style={styles.faqQuestion}>When will paid plans start?</Text>
//             <Text style={styles.faqAnswer}>
//               We'll notify all users 30 days before introducing any paid features.
//             </Text>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: m(16),
//     paddingBottom: m(40),
//   },
  
//   // Hero Section
//   heroSection: {
//     alignItems: 'center',
//     marginBottom: m(24),
//   },
//   badge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#10B981',
//     paddingHorizontal: m(12),
//     paddingVertical: m(6),
//     borderRadius: m(20),
//     gap: m(6),
//     marginBottom: m(12),
//   },
//   badgeText: {
//     fontSize: m(14),
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
//   heroTitle: {
//     fontSize: m(28),
//     fontWeight: '700',
//     color: '#111827',
//     textAlign: 'center',
//     marginBottom: m(8),
//   },
//   heroSubtitle: {
//     fontSize: m(16),
//     color: '#6B7280',
//     textAlign: 'center',
//     lineHeight: m(24),
//     maxWidth: '90%',
//   },
  
//   // Plan Cards
//   plansContainer: {
//     gap: m(16),
//     marginBottom: m(24),
//   },
//   planCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: m(16),
//     padding: m(20),
//     borderWidth: 2,
//     borderColor: '#E5E7EB',
//     position: 'relative',
//   },
//   popularPlanCard: {
//     borderColor: '#3B82F6',
//   },
//   selectedPlanCard: {
//     borderColor: '#10B981',
//     backgroundColor: '#F0FDF4',
//   },
//   popularBadge: {
//     position: 'absolute',
//     top: m(-10),
//     right: m(20),
//     backgroundColor: '#3B82F6',
//     paddingHorizontal: m(12),
//     paddingVertical: m(4),
//     borderRadius: m(20),
//   },
//   popularBadgeText: {
//     fontSize: m(12),
//     fontWeight: '700',
//     color: '#FFFFFF',
//   },
//   planHeader: {
//     marginBottom: m(20),
//   },
//   planName: {
//     fontSize: m(20),
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: m(8),
//   },
//   priceContainer: {
//     flexDirection: 'row',
//     alignItems: 'baseline',
//     gap: m(4),
//   },
//   price: {
//     fontSize: m(36),
//     fontWeight: '700',
//     color: '#111827',
//   },
//   period: {
//     fontSize: m(16),
//     color: '#6B7280',
//   },
//   featuresList: {
//     gap: m(12),
//     marginBottom: m(16),
//   },
//   featureItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: m(8),
//   },
//   featureText: {
//     fontSize: m(14),
//     color: '#374151',
//     flex: 1,
//   },
//   selectedIndicator: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: m(8),
//     paddingTop: m(12),
//     borderTopWidth: 1,
//     borderTopColor: '#E5E7EB',
//   },
//   selectedText: {
//     fontSize: m(14),
//     fontWeight: '600',
//     color: '#10B981',
//   },
  
//   // Free Card
//   freeCard: {
//     backgroundColor: '#ECFDF5',
//     borderRadius: m(16),
//     padding: m(20),
//     marginBottom: m(24),
//     borderWidth: 1,
//     borderColor: '#D1FAE5',
//   },
//   freeCardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: m(12),
//     marginBottom: m(12),
//   },
//   freeCardTitle: {
//     fontSize: m(18),
//     fontWeight: '600',
//     color: '#065F46',
//   },
//   freeCardText: {
//     fontSize: m(15),
//     color: '#047857',
//     lineHeight: m(22),
//   },
  
//   // Actions
//   actionsContainer: {
//     gap: m(12),
//     marginBottom: m(24),
//   },
//   freeButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: m(8),
//     backgroundColor: '#10B981',
//     borderRadius: m(12),
//     padding: m(18),
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   freeButtonText: {
//     fontSize: m(16),
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
//   premiumButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: m(8),
//     backgroundColor: 'black',
//     borderRadius: m(12),
//     padding: m(18),
//   },
//   premiumButtonText: {
//     fontSize: m(16),
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
  
//   // Benefits
//   benefitsSection: {
//     marginBottom: m(24),
//   },
//   benefitsTitle: {
//     fontSize: m(20),
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: m(16),
//   },
//   benefitsGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   benefitItem: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   benefitIcon: {
//     width: m(48),
//     height: m(48),
//     borderRadius: m(12),
//     backgroundColor: '#F9FAFB',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: m(8),
//   },
//   benefitTitle: {
//     fontSize: m(14),
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: m(2),
//   },
//   benefitDesc: {
//     fontSize: m(12),
//     color: '#6B7280',
//     textAlign: 'center',
//   },
  
//   // FAQ
//   faqSection: {
//     marginBottom: m(24),
//   },
//   faqTitle: {
//     fontSize: m(20),
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: m(16),
//   },
//   faqItem: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: m(12),
//     padding: m(16),
//     marginBottom: m(12),
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   faqQuestion: {
//     fontSize: m(16),
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: m(8),
//   },
//   faqAnswer: {
//     fontSize: m(14),
//     color: '#6B7280',
//     lineHeight: m(20),
//   },
// });

// export default SubscriptionScreen;


import React, { useState } from 'react';
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
import { m } from 'walstar-rn-responsive';
import Header from '../../Components/Header';

// Subscription Screen Component
const SubscriptionScreen = ({ navigation }) => {
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
      [{ text: 'OK', onPress: () => navigation.goBack() }],
      { cancelable: false },
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Bar */}
        <Header title="Subscription" showBackButton />

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
              Monthly Plan - ₹99
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
              Yearly Plan - ₹899
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
    marginBottom: 18,
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
    backgroundColor: '#e74c3c',
    borderRadius: m(8),
    paddingVertical: m(14),
    alignItems: 'center',
    width: '90%',
    elevation: m(5),
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default SubscriptionScreen;

