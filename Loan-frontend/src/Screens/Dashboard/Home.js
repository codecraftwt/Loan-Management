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
import Icon from 'react-native-vector-icons/Feather';
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

  const [refreshing, setRefreshing] = useState(false);

  useFetchUserFromStorage();

  const aadhaarNumber = user?.aadhaarNumber || user?.aadharCardNo;

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getLoanStats(aadhaarNumber));
    }, [dispatch, user, loanCount]),
  );

  const loanStats = [
    {
      title: 'Loans Given',
      value: loanCount?.loansGivenCount || 0,
      icon: 'arrow-up-circle',
      backgroundColor: '#8e44ad',
      gradient: ['#8e44ad', '#9b59b6'],
    },
    {
      title: 'Loans Taken',
      value: loanCount?.loansTakenCount || 0,
      icon: 'arrow-down-circle',
      backgroundColor: '#e67e22',
      gradient: ['#e67e22', '#f39c12'],
    },
    {
      title: 'Loans Paid',
      value: loanCount?.loansPaidCount || 0,
      icon: 'check-circle',
      backgroundColor: '#2ecc71',
      gradient: ['#2ecc71', '#27ae60'],
    },
    {
      title: 'Active Loans',
      value: loanCount?.loansPendingCount || 0,
      icon: 'clock',
      backgroundColor: '#2980b9',
      gradient: ['#2980b9', '#3498db'],
    },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(getLoanStats(aadhaarNumber));
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Header title="Home" />

      <ScrollView
        contentContainerStyle={styles.cardsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.statsSection}>
          <Text style={styles.welcomeText}>
            Welcome, {user?.userName || 'User'}
          </Text>
          <Text style={styles.subtitle}>
            Track your loan activities at a glance
          </Text>

          <View style={styles.statsWrapper}>
            {loanStats.map((stat, index) => (
              <View
                key={index}
                style={[
                  styles.statCard,
                  {
                    backgroundColor: stat.backgroundColor,
                    shadowColor: stat.backgroundColor,
                  },
                ]}>
                <Icon name={stat.icon} size={36} color="#fff" />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.additionalInfo}>
            Unlock premium features to manage your loans effectively.
          </Text>

          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={() => navigation.navigate('SubscriptionScreen')}>
            <Text style={styles.subscribeButtonText}>Upgrade to Premium</Text>
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
    color: '#333',
  },
  subtitle: {
    fontSize: m(16),
    color: '#555',
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
    elevation: m(10),
    shadowOffset: {width: 0, height: m(4)},
    shadowOpacity: 0.2,
    shadowRadius: m(5),
    marginBottom: m(20),
  },
  statValue: {
    fontSize: m(24),
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    marginTop: m(10),
  },
  statTitle: {
    fontSize: m(14),
    color: '#fff',
    fontFamily: 'Poppins-Regular',
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
    marginVertical: m(20),
  },
  subscribeButton: {
    backgroundColor: '#e74c3c',
    borderRadius: m(8),
    paddingVertical: m(14),
    alignItems: 'center',
    width: '80%',
    elevation: m(5),
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: m(16),
    fontFamily: 'Montserrat-SemiBold',
  },
});
