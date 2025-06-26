import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useRef } from 'react';
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

const TOTAL_TIME = 30; // seconds countdown for timed mode
const NUM_QUESTIONS = 3; // Number of questions per quiz

// Generate easy random multiplication questions under 20
const generateQuestions = (num) => {
  const qs = [];
  for (let i = 0; i < num; i++) {
    const a = Math.floor(Math.random() * 10) + 1; // 1 to 10
    const b = Math.floor(Math.random() * 10) + 1; // 1 to 10
    qs.push({ question: `${a} × ${b}`, answer: a * b });
  }
  return qs;
};

const Multiplication = () => {
  const [mode, setMode] = useState(null); // 'normal' or 'timed'
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);
  const router = useRouter();

  const translateY = useSharedValue(0);
  const timerRef = useRef(null);

  // Generate questions on mount
  useEffect(() => {
    setQuestions(generateQuestions(NUM_QUESTIONS));
  }, []);

  // Generate options for current question once mode & currentQ & questions are ready
  useEffect(() => {
    if (mode && questions.length) {
      setOptions(generateOptions(questions[currentQ].answer));
    }
  }, [mode, currentQ, questions]);

  // Timer countdown for timed mode
  useEffect(() => {
    if (mode === 'timed') {
      setTimeLeft(TOTAL_TIME);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setShowScore(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [mode]);

  // Bounce animation and save score on quiz completion
  useEffect(() => {
    if (showScore) {
      clearInterval(timerRef.current);
      translateY.value = withRepeat(
        withSequence(
          withTiming(-20, { duration: 400 }),
          withTiming(0, { duration: 400 })
        ),
        -1,
        true
      );

      // Save multiplication score to AsyncStorage
      const saveProgress = async () => {
        try {
          await AsyncStorage.setItem(
            'multiplicationScore',
            JSON.stringify({ score, total: questions.length })
          );
        } catch (err) {
          console.error('Error saving multiplication score:', err);
        }
      };

      saveProgress();
    }
  }, [showScore]);

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleAnswer = (selected) => {
    setSelectedOption(selected);

    const correct = questions[currentQ].answer;
    const updatedScore = selected === correct ? score + 1 : score;

    if (selected === correct) setScore(updatedScore);

    setTimeout(() => {
      setSelectedOption(null);
      const nextQ = currentQ + 1;
      if (nextQ < questions.length) {
        setCurrentQ(nextQ);
      } else {
        clearInterval(timerRef.current);
        setShowScore(true);
      }
    }, 400);
  };

  // Generate 4 answer options including correct answer, no duplicates
  const generateOptions = (answer) => {
    const opts = [answer];
    while (opts.length < 4) {
      const random = Math.floor(Math.random() * 100); // bigger range for multiplication
      if (!opts.includes(random)) opts.push(random);
    }
    return opts.sort(() => Math.random() - 0.5);
  };

  const handleShareOnTwitter = async () => {
    const tweet = `I scored ${score} out of ${questions.length} on the Multiplication Quiz! ${
      mode === 'timed' ? `Time Left: ${timeLeft}s` : ''
    } #MathQuiz #MyScore`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
    try {
      await Linking.openURL(url);
    } catch (error) {
      alert('Error sharing to Twitter: ' + error.message);
    }
  };

  if (!mode) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Start Multiplication Quiz</Text>
        <Pressable style={styles.button} onPress={() => setMode('normal')}>
          <Text style={styles.buttonText}>Normal Mode</Text>
        </Pressable>
        <Pressable style={[styles.button, { backgroundColor: '#10b981' }]} onPress={() => setMode('timed')}>
          <Text style={styles.buttonText}>Timed Mode (30s countdown)</Text>
        </Pressable>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading Questions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showScore ? (
        <>
          <Animated.View style={[styles.bounceContainer, bounceStyle]}>
            <Image source={animated} style={styles.image} />
          </Animated.View>

          <Text style={styles.title}>Quiz Finished!</Text>
          <Text style={styles.score}>
            Your Score: {score} / {questions.length}
          </Text>
          {mode === 'timed' && (
            <Text style={styles.score}>Time Left: {timeLeft}s</Text>
          )}

          <Pressable
            style={[styles.button, { backgroundColor: '#1DA1F2' }]}
            onPress={handleShareOnTwitter}
          >
            <Text style={styles.buttonText}>Share on Twitter</Text>
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={() => router.replace('/explore')}
          >
            <Text style={styles.buttonText}>Back to Explore</Text>
          </Pressable>
        </>
      ) : (
        <>
          {mode === 'timed' && (
            <View style={styles.timerContainer}>
              <Text style={styles.timerLabel}>Time Left:</Text>
              <Text style={styles.timerValue}>{timeLeft}s</Text>
            </View>
          )}

          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${((currentQ + 1) / questions.length) * 100}%` },
              ]}
            />
          </View>

          <Text style={styles.question}>
            Question {currentQ + 1}: {questions[currentQ].question}
          </Text>

          {options.map((option, idx) => (
            <Pressable
              key={idx}
              style={[
                styles.optionButton,
                selectedOption === option &&
                  (option === questions[currentQ].answer
                    ? styles.correctOption
                    : styles.wrongOption),
              ]}
              onPress={() => handleAnswer(option)}
            >
              <Text style={styles.optionButtonText}>{option}</Text>
            </Pressable>
          ))}
        </>
      )}
    </View>
  );
};

export default Multiplication;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fff4',
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
    fontWeight: 'bold',
  },
  timerContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  timerLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ef4444',
    marginRight: 5,
  },
  timerValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ef4444',
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
  question: {
    fontSize: 24,
    fontWeight: 'bold',
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
  optionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'normal',
  },
  correctOption: {
    backgroundColor: '#22c55e',
  },
  wrongOption: {
    backgroundColor: '#ef4444',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'normal',
  },
});
