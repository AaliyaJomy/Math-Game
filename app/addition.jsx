// Updated green-themed addition quiz screen with animation, timer, bubbles, and modern UI
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

const TOTAL_TIME = 30;
const NUM_QUESTIONS = 3;

const generateQuestions = (num) => {
  const qs = [];
  for (let i = 0; i < num; i++) {
    const a = Math.floor(Math.random() * 10) + 1;
    const maxB = 19 - a;
    const b = Math.floor(Math.random() * maxB) + 1;
    qs.push({ question: `${a} + ${b}`, answer: a + b });
  }
  return qs;
};

const Addition = () => {
  const [mode, setMode] = useState(null);
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

  useEffect(() => {
    if (mode) {
      setQuestions(generateQuestions(NUM_QUESTIONS));
      setCurrentQ(0);
      setScore(0);
      setShowScore(false);
      setTimeLeft(TOTAL_TIME);
      setSelectedOption(null);
    }
  }, [mode]);

  useEffect(() => {
    if (mode && questions.length) {
      setOptions(generateOptions(questions[currentQ].answer));
    }
  }, [mode, currentQ, questions]);

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
    }
  }, [showScore]);

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleAnswer = async (selected) => {
    setSelectedOption(selected);
    const correct = questions[currentQ].answer;
    const updatedScore = selected === correct ? score + 1 : score;

    if (selected === correct) setScore(updatedScore);

    setTimeout(async () => {
      setSelectedOption(null);

      const nextQ = currentQ + 1;
      if (nextQ < questions.length) {
        setCurrentQ(nextQ);
      } else {
        clearInterval(timerRef.current);
        setShowScore(true);
        try {
          await AsyncStorage.setItem(
            'additionScore',
            JSON.stringify({
              score: updatedScore,
              total: questions.length,
            })
          );
        } catch (error) {
          console.error('Error saving score:', error);
        }
      }
    }, 400);
  };

  const generateOptions = (answer) => {
    const opts = [answer];
    while (opts.length < 4) {
      const random = Math.floor(Math.random() * 20);
      if (!opts.includes(random)) opts.push(random);
    }
    return opts.sort(() => Math.random() - 0.5);
  };

  const handleShareOnTwitter = async () => {
    const tweet = `I scored ${score} out of ${questions.length} on the Addition Quiz! ${
      mode === 'timed' ? `Time Left: ${timeLeft}s` : ''
    } #MathQuiz #MyScore`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
    try {
      await Linking.openURL(url);
    } catch (error) {
      alert('Error sharing: ' + error.message);
    }
  };

  if (!mode) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Start Addition Quiz</Text>
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
        <View style={styles.scoreContainer}>
          <Animated.View style={[styles.bounceContainer, bounceStyle]}>
            <Image source={animated} style={styles.animatedImage} />
          </Animated.View>
          <Text style={styles.resultTitle}>🎉 Quiz Complete!</Text>
          <View style={styles.resultCard}>
            <Text style={styles.resultScore}>You scored <Text style={styles.highlight}>{score}</Text> out of <Text style={styles.highlight}>{questions.length}</Text></Text>
            {mode === 'timed' && <Text style={styles.timeRemaining}>⏱ Time Left: <Text style={styles.highlight}>{timeLeft}s</Text></Text>}
          </View>
          <Pressable style={[styles.primaryButton]} onPress={handleShareOnTwitter}>
            <Text style={styles.buttonText}> Share on Twitter</Text>
          </Pressable>
          <Pressable style={[styles.primaryButton, { backgroundColor: '#10b981' } ]} onPress={() => router.replace('/explore')}>
            <Text style={styles.buttonText}>Back to Explore</Text>
          </Pressable>
        </View>
      ) : (
        <>
          {mode === 'timed' && (
            <View style={styles.timerContainer}>
              <Text style={styles.timerLabel}>Time Left:</Text>
              <Text style={styles.timerValue}>{timeLeft}s</Text>
            </View>
          )}

          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${((currentQ + 1) / questions.length) * 100}%` }]} />
          </View>

          <Text style={styles.question}>Question {currentQ + 1}: {questions[currentQ].question}</Text>

          {options.map((option, idx) => (
            <Pressable
              key={idx}
              style={[styles.optionButton,
                selectedOption === option
                  ? option === questions[currentQ].answer
                    ? styles.correctOption
                    : styles.wrongOption
                  : null]}
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

export default Addition;


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
    backgroundColor: '#fff',
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
resultTitle: {
  fontSize: 30,
  fontWeight: 'bold',
  color: '#0f172a',
  marginBottom: 20,
},
resultCard: {
  backgroundColor: '#ffffff',
  padding: 20,
  borderRadius: 16,
  width: '100%',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 6,
  elevation: 5,
  marginBottom: 30,
},
resultScore: {
  fontSize: 22,
  fontWeight: '600',
  color: '#0f172a',
  marginBottom: 10,
},
timeRemaining: {
  fontSize: 18,
  color: '#ef4444',
  fontWeight: '500',
},
highlight: {
  fontWeight: 'bold',
  color: '#10b981',
},
primaryButton: {
  backgroundColor: '#3b82f6',
  paddingVertical: 14,
  paddingHorizontal: 28,
  borderRadius: 12,
  marginVertical: 10,
  width: '100%',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 3,
},
animatedImage: {
  width: 120,
  height: 120,
  marginBottom: 10,
},

});
