import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

const API_URL = 'https://swapi.info/api/films';

export default function FilmsScreen() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [submittedText, setSubmittedText] = useState('');
  const [swipeModalVisible, setSwipeModalVisible] = useState(false);
  const [swipeItemText, setSwipeItemText] = useState('');

  const handleSearch = () => {
    if (searchText.trim() === '') return;
    setSubmittedText(searchText.trim());
    setModalVisible(true);
  };

  const handleSwipe = (title) => {
    setSwipeItemText(title);
    setSwipeModalVisible(true);
  };

  const renderRightAction = () => (
    <View style={styles.swipeAction}>
      <Text style={styles.swipeActionText}>View</Text>
    </View>
  );

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const sorted = data.sort((a, b) => a.episode_id - b.episode_id);
        setFilms(sorted);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const renderItem = (item) => (
    <Swipeable
      key={item.url}
      renderRightActions={renderRightAction}
      onSwipeableOpen={() => handleSwipe(item.title)}
    >
      <View style={styles.card}>
        <Text style={styles.episode}>Episode {item.episode_id}</Text>
        <Text style={styles.name}>{item.title}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Director</Text>
          <Text style={styles.value}>{item.director}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Producer</Text>
          <Text style={styles.value}>{item.producer}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Released</Text>
          <Text style={styles.value}>{item.release_date}</Text>
        </View>
        <Text style={styles.crawl} numberOfLines={3}>
          {item.opening_crawl.replace(/\r\n/g, ' ')}
        </Text>
      </View>
    </Swipeable>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FFE81F" />
        <Text style={styles.loadingText}>Loading Films...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search films..."
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Search Term</Text>
            <Text style={styles.modalBody}>{submittedText}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={swipeModalVisible}
        onRequestClose={() => setSwipeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Film</Text>
            <Text style={styles.modalBody}>{swipeItemText}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setSwipeModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.list}>
        {films.map((item) => renderItem(item))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a2e',
  },
  list: {
    padding: 12,
  },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFE81F',
  },
  episode: {
    fontSize: 12,
    color: '#FFE81F',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  label: {
    fontSize: 13,
    color: '#888',
    flex: 1,
  },
  value: {
    fontSize: 13,
    color: '#ccc',
    flex: 2,
    textAlign: 'right',
  },
  crawl: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 10,
    lineHeight: 18,
  },
  loadingText: {
    color: '#ccc',
    marginTop: 10,
    fontSize: 14,
  },
  swipeAction: {
    backgroundColor: '#e63946',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginBottom: 10,
    borderRadius: 8,
  },
  swipeActionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
  },
  searchBar: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#16213e',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE81F',
  },
  input: {
    flex: 1,
    backgroundColor: '#0f3460',
    color: '#fff',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: '#FFE81F',
    borderRadius: 6,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#1a1a2e',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 24,
    width: '75%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE81F',
  },
  modalTitle: {
    color: '#FFE81F',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modalBody: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#FFE81F',
    borderRadius: 6,
    paddingHorizontal: 32,
    paddingVertical: 10,
  },
  modalButtonText: {
    color: '#1a1a2e',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
