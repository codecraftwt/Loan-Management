import React, {useEffect, useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  RefreshControl,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather'; // Importing Feather icons for buttons
import {logo} from '../../Assets';
import {getLoanStats} from '../../Redux/Slices/loanSlice';
import {useDispatch, useSelector} from 'react-redux';
import useFetchUserFromStorage from '../../Redux/hooks/useFetchUserFromStorage';
import {m} from 'walstar-rn-responsive';
import Header from '../../Components/Header';

export default function Home() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const user = useSelector(state => state.auth.user);
  const loanCount = useSelector(state => state.loans.loanStats);

  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh

  useFetchUserFromStorage();

  const aadhaarNumber = user?.aadhaarNumber || user?.aadharCardNo;

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getLoanStats(aadhaarNumber));
    }, [dispatch, user, loanCount]),
  );

  // Static data for loan stats
  const loanStats = [
    {
      title: 'Loans Given',
      value: loanCount?.loansGivenCount || 0,
      icon: 'arrow-up-circle',
      backgroundColor: '#b80266',
    },
    {
      title: 'Loans Taken',
      value: loanCount?.loansTakenCount || 0,
      icon: 'arrow-down-circle',
      backgroundColor: '#4CAF50',
    },
    {
      title: 'Loans Paid',
      value: loanCount?.loansPaidCount || 0,
      icon: 'check-circle',
      backgroundColor: '#2196F3',
    },
    {
      title: 'Active Loans',
      value: loanCount?.loansPendingCount || 0,
      icon: 'clock',
      backgroundColor: 'gray',
    },
  ];

  // Pull-to-refresh function
  const onRefresh = async () => {
    setRefreshing(true); // Set refreshing to true
    await dispatch(getLoanStats(aadhaarNumber)); // Fetch the loan stats again
    setRefreshing(false); // Set refreshing to false after fetching
  };

  return (
    <View style={styles.container}>
      <Header title="Home" />

      <ScrollView
        contentContainerStyle={styles.cardsContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing} // Pass the refreshing state
            onRefresh={onRefresh} // Call onRefresh function when pull-to-refresh happens
          />
        }>
        {/* Main Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.welcomeText}>Welcome to the Loan App</Text>
          <Text style={styles.subtitle}>Track your loan activities</Text>

          <View style={styles.statsWrapper}>
            {loanStats.map((stat, index) => (
              <View
                key={index}
                style={[
                  styles.statCard,
                  {backgroundColor: stat.backgroundColor},
                ]}>
                <Icon name={stat.icon} size={36} color="#fff" />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Subscribe Section */}
        <View style={styles.content}>
          <Text style={styles.additionalInfo}>
            For our premium features, please subscribe to our service
          </Text>

          {/* Subscribe Button */}
          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={() => navigation.navigate('SubscriptionScreen')}>
            <Text style={styles.subscribeButtonText}>Subscribe Here</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  cardsContainer: {
    marginTop: m(30),
  },
  statsSection: {
    alignItems: 'center',
    marginTop: m(10),
    paddingHorizontal: m(20),
  },
  welcomeText: {
    fontSize: m(22),
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
    marginBottom: m(10),
    color: '#000',
  },
  subtitle: {
    fontSize: m(16),
    color: '#777',
    textAlign: 'center',
    marginBottom: m(15),
  },
  statsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: m(20),
    width: '100%',
    flexWrap: 'wrap',
    paddingHorizontal: m(20),
  },
  statCard: {
    width: '45%',
    height: m(130),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: m(20),
    padding: m(15),
    elevation: m(5),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: m(2)},
    shadowOpacity: 0.1,
    shadowRadius: m(5),
    marginBottom: m(20),
  },
  statValue: {
    fontSize: m(24),
    fontWeight: 'bold',
    color: '#fff',
    marginTop: m(10),
  },
  statTitle: {
    fontSize: m(14),
    color: '#fff',
    fontWeight: 'bold',
    marginTop: m(5),
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: m(20),
  },
  additionalInfo: {
    fontSize: m(16),
    color: '#777',
    textAlign: 'center',
    marginBlock: m(20),
  },
  subscribeButton: {
    backgroundColor: '#b80266',
    borderRadius: m(8),
    paddingVertical: m(14),
    alignItems: 'center',
    width: '80%',
    marginTop: m(20),
    marginBottom: m(20),
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: m(16),
    fontWeight: 'bold',
  },
});
