import React, { useCallback, useContext, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import getCountryNews from '../apis/countryNews';
import Card from '../components/Card';
import TrendNews from './TrendNews';
import themeContext from '../config/themeContext';

const COUNTRIES = [
  { code: 'in', name: 'India' },
  { code: 'us', name: 'United States' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'ca', name: 'Canada' },
  { code: 'au', name: 'Australia' },
  { code: 'de', name: 'Germany' },
  { code: 'jp', name: 'Japan' },
  { code: 'nz', name: 'New Zealand' },
  { code: 'fr', name: 'France' },
  { code: 'cn', name: 'China' }
];

const Home = ({ navigation }) => {
  const [isLoading, setLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);
  const [articles, setArticles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const requestId = useRef(0);
  const hasArticles = useRef(false);
  const theme = useContext(themeContext);
  const { width } = useWindowDimensions();

  const getNewsFromAPI = useCallback(async () => {
    const currentRequestId = ++requestId.current;
    if (!hasArticles.current) setLoading(true);
    else setRefreshing(true);
    setErrorMessage('');
    try {
      const nextArticles = await getCountryNews(selectedCountry.code);
      if (currentRequestId !== requestId.current) return;
      hasArticles.current = nextArticles.length > 0;
      setArticles(nextArticles);
      setLastUpdated(new Date());
    } catch (error) {
      if (currentRequestId !== requestId.current) return;
      console.error(`Unable to load ${selectedCountry.name} headlines:`, error);
      setErrorMessage(`We couldn’t load ${selectedCountry.name} news. Check your connection and try again.`);
    } finally {
      if (currentRequestId === requestId.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [selectedCountry]);

  useFocusEffect(
    useCallback(() => {
      getNewsFromAPI();
      const refreshInterval = setInterval(getNewsFromAPI, 30 * 60 * 1000);
      return () => clearInterval(refreshInterval);
    }, [getNewsFromAPI])
  );

  const selectCountry = (country) => {
    if (country.code === selectedCountry.code) return;
    requestId.current += 1;
    hasArticles.current = false;
    setSelectedCountry(country);
    setArticles([]);
    setLastUpdated(null);
    setErrorMessage('');
    setLoading(true);
  };

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <View style={[styles.page, { backgroundColor: theme.backColor }]}>
      <StatusBar backgroundColor={theme.statusColor} barStyle={theme.theme === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { backgroundColor: theme.headerColor, borderBottomColor: theme.borderColor }]}>
        <View style={styles.headerInner}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Open navigation menu"
            onPress={() => {
              const parent = navigation.getParent();
              if (parent && parent.openDrawer) parent.openDrawer();
            }}
            style={styles.menuButton}
          >
            <Ionicons name="menu-outline" size={25} color={theme.textColor} />
          </TouchableOpacity>
          <View style={styles.logoWrap}>
            <Image source={require('../assets/img/header-logo.png')} style={styles.logo} resizeMode="contain" />
          </View>
          <View style={styles.brand}>
            <Text style={[styles.brandName, { color: theme.textColor }]}>NewsX</Text>
            <Text style={[styles.brandTagline, { color: theme.secondaryTextColor }]}>THE WORLD, IN FOCUS</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { maxWidth: Math.min(width, 1120) }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={getNewsFromAPI}
            tintColor={theme.accentColor}
            colors={[theme.accentColor]}
          />
        }
      >
        <View style={styles.welcome}>
          <Text style={[styles.date, { color: theme.secondaryTextColor }]}>{today}</Text>
          <Text style={[styles.headline, { color: theme.textColor }]}>Your world, up to date.</Text>
          <Text style={[styles.intro, { color: theme.secondaryTextColor }]}>
            Fresh headlines from around the world, updated throughout the day.
          </Text>
        </View>

        <View style={styles.countryHeading}>
          <View>
            <Text style={[styles.sectionEyebrow, { color: theme.accentColor }]}>EXPLORE BY COUNTRY</Text>
            <Text style={[styles.countryTitle, { color: theme.textColor }]}>Choose your edition</Text>
          </View>
          <View style={[styles.liveBadge, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor }]}>
            <View style={styles.liveDot} />
            <Text style={[styles.liveText, { color: theme.secondaryTextColor }]}>AUTO UPDATE</Text>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.countryList}
        >
          {COUNTRIES.map((country) => {
            const isSelected = country.code === selectedCountry.code;
            return (
              <TouchableOpacity
                key={country.code}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => selectCountry(country)}
                style={[
                  styles.countryChip,
                  {
                    backgroundColor: isSelected ? theme.accentColor : theme.cardBackground,
                    borderColor: isSelected ? theme.accentColor : theme.borderColor
                  }
                ]}
              >
                <View style={[
                  styles.countryCodeBadge,
                  { backgroundColor: isSelected ? 'rgba(255,255,255,0.18)' : theme.backColor }
                ]}>
                  <Text style={[
                    styles.countryCode,
                    { color: isSelected ? '#FFFFFF' : theme.accentColor }
                  ]}>
                    {country.code.toUpperCase()}
                  </Text>
                </View>
                <Text style={[
                  styles.countryName,
                  { color: isSelected ? '#FFFFFF' : theme.textColor }
                ]}>
                  {country.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeading}>
          <View>
            <Text style={[styles.sectionEyebrow, { color: theme.accentColor }]}>{selectedCountry.name.toUpperCase()} EDITION</Text>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Top stories</Text>
          </View>
          <Ionicons name="newspaper-outline" size={22} color={theme.accentColor} />
        </View>
        <TrendNews articles={articles.slice(0, 5)} isLoading={isLoading} />

        <View style={[styles.sectionHeading, styles.recentHeading]}>
          <View>
            <Text style={[styles.sectionEyebrow, { color: theme.accentColor }]}>THE LATEST</Text>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>{selectedCountry.name} news</Text>
            <Text style={[styles.updatedText, { color: theme.secondaryTextColor }]}>
              {lastUpdated
                ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
                : 'Updated automatically throughout the day'}
            </Text>
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Refresh latest news"
            onPress={() => getNewsFromAPI()}
            style={[styles.refreshButton, { borderColor: theme.borderColor }]}
          >
            <Ionicons name="refresh-outline" size={18} color={theme.accentColor} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.stateBox}>
            <ActivityIndicator size="large" color={theme.accentColor} />
            <Text style={[styles.stateText, { color: theme.secondaryTextColor }]}>Finding the latest stories…</Text>
          </View>
        ) : errorMessage ? (
          <View style={[styles.stateBox, styles.messageCard, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor }]}>
            <Ionicons name="cloud-offline-outline" size={28} color={theme.accentColor} />
            <Text style={[styles.stateText, { color: theme.textColor }]}>{errorMessage}</Text>
            <TouchableOpacity onPress={() => getNewsFromAPI()} style={styles.retryButton}>
              <Text style={styles.retryText}>Try again</Text>
            </TouchableOpacity>
          </View>
        ) : articles.length ? (
          articles.map((item, index) => (
            <Card key={item.url || `${item.title || 'story'}-${index}`} item={item} />
          ))
        ) : (
          <View style={[styles.stateBox, styles.messageCard, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor }]}>
            <Text style={[styles.stateText, { color: theme.secondaryTextColor }]}>No recent stories are available right now.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1
  },
  header: {
    borderBottomWidth: 1,
    elevation: 2
  },
  headerInner: {
    width: '100%',
    maxWidth: 1120,
    alignSelf: 'center',
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  menuButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  logoWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#D92D45',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  logo: {
    width: 29,
    height: 29
  },
  brand: {
    marginLeft: 9
  },
  brandName: {
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 0.3
  },
  brandTagline: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginTop: 2
  },
  headerSpacer: {
    flex: 1
  },
  scroll: {
    flex: 1
  },
  content: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40
  },
  welcome: {
    paddingTop: 32,
    paddingBottom: 25
  },
  date: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 9
  },
  headline: {
    fontSize: 32,
    lineHeight: 39,
    fontWeight: '900',
    letterSpacing: -0.5
  },
  intro: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    maxWidth: 620
  },
  countryHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  countryTitle: {
    fontSize: 18,
    fontWeight: '800'
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#24B47E',
    marginRight: 6
  },
  liveText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  countryList: {
    paddingBottom: 26
  },
  countryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 9
  },
  countryCodeBadge: {
    minWidth: 27,
    height: 23,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    paddingHorizontal: 4
  },
  countryCode: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.3
  },
  countryName: {
    fontSize: 13,
    fontWeight: '700'
  },
  sectionHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  sectionEyebrow: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
    marginBottom: 4
  },
  sectionTitle: {
    fontSize: 23,
    lineHeight: 29,
    fontWeight: '900'
  },
  recentHeading: {
    marginTop: 30,
    marginBottom: 17
  },
  updatedText: {
    fontSize: 12,
    marginTop: 3
  },
  refreshButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  stateBox: {
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 22
  },
  messageCard: {
    borderWidth: 1,
    borderRadius: 16
  },
  stateText: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 10
  },
  retryButton: {
    backgroundColor: '#D92D45',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 9,
    marginTop: 12
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  }
});

export default Home;
