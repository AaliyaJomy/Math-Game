import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router'; // Import router for navigation

const generateTiles = () => {
  const questions = [
    { problem: '3 + 4', answer: 7 },
    { problem: '2 × 3', answer: 6 },
    { problem: '5 + 4', answer: 9 },
    { problem: '6 × 2', answer: 12 },
    { problem: '8 + 3', answer: 11 },
    { problem: '7 × 2', answer: 14 },
  ];

  const tiles = [];

  // Add problems and answers as separate tiles
  questions.forEach((q, index) => {
    tiles.push({ id: `q${index}`, type: 'problem', value: q.problem, answer: q.answer });
    tiles.push({ id: `a${index}`, type: 'answer', value: q.answer.toString(), answer: q.answer });
  });

  // Shuffle the tiles to make the game interesting
  return tiles.sort(() => Math.random() - 0.5);
};

const Puzzle = () => {
  const [tiles, setTiles] = useState(generateTiles());
  const [flipped, setFlipped] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const router = useRouter();  // Router instance for navigation

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      setAttempts((prev) => prev + 1);

      const firstTile = tiles.find((t) => t.id === first);
      const secondTile = tiles.find((t) => t.id === second);

      const isMatch =
        firstTile &&
        secondTile &&
        ((firstTile.type === 'problem' && secondTile.type === 'answer') ||
          (firstTile.type === 'answer' && secondTile.type === 'problem')) &&
        firstTile.answer === secondTile.answer;

      setTimeout(() => {
        if (isMatch) {
          setMatchedIds([...matchedIds, first, second]);
        }
        setFlipped([]);
      }, 700);
    }
  }, [flipped]);

  useEffect(() => {
    if (matchedIds.length >= 12) {
      // Once all pairs are matched, alert the user and show the option to return to Explore
      Alert.alert('🎉 Congratulations!', `You completed the puzzle in ${attempts} attempts!`, [
        {
          text: 'Return to Explore',
          onPress: () => router.push('/explore'),  // Navigate to Explore screen
        },
      ]);
    }
  }, [matchedIds]);

  const resetGame = () => {
    setTiles(generateTiles());
    setFlipped([]);
    setMatchedIds([]);
    setAttempts(0);
  };

  const handlePress = (id) => {
    if (flipped.length < 2 && !flipped.includes(id) && !matchedIds.includes(id)) {
      setFlipped([...flipped, id]);
    }
  };

  const isVisible = (id) => flipped.includes(id) || matchedIds.includes(id);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧠 Math Match Puzzle</Text>
      <Text style={styles.instructions}>
        Match the math problem with its correct answer. Tap two tiles at a time!
      </Text>

      <View style={styles.grid}>
        {tiles.map((tile) => (
          <Pressable
            key={tile.id}
            style={[
              styles.tile,
              isVisible(tile.id) ? styles.visibleTile : styles.hiddenTile,
              matchedIds.includes(tile.id) && styles.matchedTile,
            ]}
            onPress={() => handlePress(tile.id)}
          >
            <Text style={styles.tileText}>
              {isVisible(tile.id) ? tile.value : '?'}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.attempts}>Attempts: {attempts}</Text>

      {/* Display final score and option to return to explore */}
      {matchedIds.length >= 12 && (
        <View style={styles.finalScoreContainer}>
          <Text style={styles.finalScoreText}>Final Score: {attempts} attempts</Text>
          <Pressable style={styles.button} onPress={() => router.push('/explore')}>
            <Text style={styles.buttonText}>Return to Explore</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default Puzzle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fff4',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#4b5563',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 320,  // 4 * 80px (tile width)
    justifyContent: 'center',
    alignItems: 'center',
  },
  tile: {
    width: 80,
    height: 80,
    margin: 5,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visibleTile: {
    backgroundColor: '#34d399',
  },
  hiddenTile: {
    backgroundColor: '#a5b4fc',
  },
  matchedTile: {
    backgroundColor: '#facc15',
  },
  tileText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  attempts: {
    marginTop: 20,
    fontSize: 18,
    color: '#6b7280',
  },
  finalScoreContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  finalScoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#34d399',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
