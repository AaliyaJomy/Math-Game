import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Linking } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import animated from '../assets/images/animated.png'; 


const questions = [
  { question: '5 + 3', answer: 8 },
  { question: '7 + 6', answer: 13 },
  { question: '9 + 4', answer: 13 },
];

const Addition = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const router = useRouter();

  // Shared value for image bounce
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (showScore) {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-20, { duration: 400 }),
          withTiming(0, { duration: 400 })
        ),
        -1,
        true
      );
    }
  }, [showScore]);

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleAnswer = (selected) => {
    const correct = questions[currentQ].answer;

    if (selected === correct) {
      setScore(score + 1);
    }

    const nextQ = currentQ + 1;
    if (nextQ < questions.length) {
      setCurrentQ(nextQ);
    } else {
      setShowScore(true);
    }
  };

  const generateOptions = (answer) => {
    const options = [answer];
    while (options.length < 4) {
      const random = Math.floor(Math.random() * 20);
      if (!options.includes(random)) {
        options.push(random);
      }
    }
    return options.sort(() => Math.random() - 0.5);
  };

  const handleShareOnTwitter = async () => {
    const tweet = `I scored ${score} out of ${questions.length} on the Addition Quiz! #MathQuiz #MyScore`;
    const encodedTweet = encodeURIComponent(tweet);
    const url = `https://twitter.com/intent/tweet?text=${encodedTweet}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      alert('Error sharing to Twitter: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      {showScore ? (
        <>
          <Animated.View style={[styles.bounceContainer, bounceStyle]}>
          <Image source={animated} style={styles.image} />

          </Animated.View>

          <Text style={styles.title}>Quiz Finished!</Text>
          <Text style={styles.score}>Your Score: {score} / {questions.length}</Text>

          <Pressable style={[styles.button, { backgroundColor: '#1DA1F2' }]} onPress={handleShareOnTwitter}>
            <Text style={styles.buttonText}>Share on Twitter</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={() => router.replace('/explore')}>
            <Text style={styles.buttonText}>Back to Explore</Text>
          </Pressable>
        </>
      ) : (
        <>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${((currentQ + (showScore ? 1 : 0)) / questions.length) * 100}%` }]} />
          </View>

          <Text style={styles.question}>
            Question {currentQ + 1}: {questions[currentQ].question}
          </Text>

          {generateOptions(questions[currentQ].answer).map((option, idx) => (
            <Pressable
              key={idx}
              style={styles.optionButton}
              onPress={() => handleAnswer(option)}
            >
              <Text style={styles.buttonText}>{option}</Text>
            </Pressable>
          ))}
        </>
      )}
    </View>
  );
};

export default Addition;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  bounceContainer: {
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  score: {
    fontSize: 22,
    marginVertical: 15,
  },
  question: {
    fontSize: 24,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#10b981',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10b981',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
