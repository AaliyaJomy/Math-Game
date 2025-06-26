import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Animated,
  FlatList,
  Dimensions,
} from 'react-native';
import { Link } from 'expo-router';

import background from '@/assets/images/background.png';
import mathBanner from '@/assets/images/mathBanner.png'; // your image below the carousel

const { width } = Dimensions.get('window');

const quotes = [
  { id: '1', text: 'Math is fun! 🎉' },
  { id: '2', text: 'Keep calm and solve on. 🧠' },
  { id: '3', text: 'Practice makes perfect! ✨' },
  { id: '4', text: 'Numbers tell stories. 📚' },
  { id: '5', text: 'You’re a math star! 🌟' },
];

const colors = ['#FFEDD5', '#E0F2FE', '#FCE7F3', '#FEF9C3', '#EDE9FE'];

const subjects = [
  { emoji: '➕', label: 'Add', color: '#DFEDB6' },
  { emoji: '➖', label: 'Subtract', color: '#A0E7E5' },
  { emoji: '✖️', label: 'Multiply', color: '#B4F8C8' },
];

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const splashOpacity = useRef(new Animated.Value(1)).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const currentIndex = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(splashOpacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => setShowSplash(false));
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % quotes.length;
      flatListRef.current?.scrollToIndex({
        index: currentIndex.current,
        animated: true,
      });
    }, 5000); // FIXED to 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  const renderQuote = ({ item, index }) => (
    <View
      style={[
        styles.quoteBox,
        { backgroundColor: colors[index % colors.length] },
      ]}
    >
      <Text style={styles.quoteText}>{item.text}</Text>
    </View>
  );

  if (showSplash) {
    return (
      <Animated.View style={[styles.splashContainer, { opacity: splashOpacity }]}>
        <Image source={background} style={styles.logo} />
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
<FlatList
  ref={flatListRef}
  data={quotes}
  keyExtractor={(item) => item.id}
  renderItem={renderQuote}
  horizontal
  pagingEnabled
  showsHorizontalScrollIndicator={false}
  getItemLayout={(_, index) => ({
    length: width - 40,
    offset: (width - 40) * index,
    index,
  })}
  scrollEnabled={true} // allow proper scrolling
/>


      {/* New image under carousel */}
      <Image source={mathBanner} style={styles.bannerImage} />

      <View style={styles.buttonsContainer}>
        <Link href="/explore" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Explore</Text>
          </Pressable>
        </Link>

        <Link href="/login" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
        </Link>
      </View>

      <View style={styles.headingBox}>
        <Text style={styles.headingText}>Let's learn some math skills!</Text>
      </View>

      <View style={styles.subjectsContainer}>
        {subjects.map((subject, index) => (
          <View
            key={index}
            style={[styles.subjectBox, { backgroundColor: subject.color }]}
          >
            <Text style={styles.subjectEmoji}>{subject.emoji}</Text>
            <Text style={styles.subjectLabel}>{subject.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fffefc',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  bannerImage: {
    width: '100%',
    height: 280,
    resizeMode: 'contain',
    marginTop: 10,
    marginBottom: 10,
  },
  quoteBox: {
    width: width - 40,
    height: 100,
    marginHorizontal: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  quoteText: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '600',
    color: '#444',
    paddingHorizontal: 20,
  },
  buttonsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'purple',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headingBox: {
    marginTop: 30,
    backgroundColor: '#FDE68A',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 18,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  headingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subjectsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 12,
  },
  subjectBox: {
    width: 100,
    height: 100,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  subjectEmoji: {
    fontSize: 36,
    marginBottom: 5,
  },
  subjectLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
