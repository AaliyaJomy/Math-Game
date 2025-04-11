import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

const questions = [
  { question: '3 × 4', answer: 12 },
  { question: '6 × 2', answer: 12 },
  { question: '5 × 5', answer: 25 },
];

const Multiplication = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const router = useRouter();

  const handleAnswer = (selected) => {
    if (selected === questions[currentQ].answer) {
      setScore(score + 1);
    }

    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowScore(true);
    }
  };

  const generateOptions = (answer) => {
    const options = [answer];
    while (options.length < 4) {
      const random = Math.floor(Math.random() * 40);
      if (!options.includes(random)) {
        options.push(random);
      }
    }
    return options.sort(() => Math.random() - 0.5);
  };

  return (
    <View style={styles.container}>
      {showScore ? (
        <>
          <Text style={styles.title}>Quiz Finished!</Text>
          <Text style={styles.score}>Your Score: {score} / {questions.length}</Text>
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
          {generateOptions(questions[currentQ].answer).map((option, index) => (
            <Pressable key={index} style={styles.optionButton} onPress={() => handleAnswer(option)}>
              <Text style={styles.buttonText}>{option}</Text>
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
