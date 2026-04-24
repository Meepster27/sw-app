import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { Swipeable } from 'react-native-gesture-handler';
import { useNetInfo } from '@react-native-community/netinfo';
import NoNetworkBanner from '../components/NoNetworkBanner';

const HERO_URI =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/1280px-Saturn_during_Equinox.jpg';

const BLURHASH = 'L03~Wt00IU~q00~q%M%M_3D%WB-;';

const API_URL = 'https://swapi.info/api/planets';

export default function PlanetsScreen() {
  const netInfo = useNetInfo();
  const [planets, setPlanets] = useState([]);
  const listAnim = useRef(new Animated.Value(0)).current;
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

  const handleSwipe = (name) => {
    setSwipeItemText(name);
    setSwipeModalVisible(true);
  };

  const renderRightAction = (name) => (
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
      .then((data) => setPlanets(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) {
      Animated.timing(listAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  const renderItem = (item) => (
    <Swipeable
      key={item.url}
      renderRightActions={() => renderRightAction(item.name)}
      onSwipeableOpen={() => handleSwipe(item.name)}
    >
      <View style={styles.card}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Climate</Text>
          <Text style={styles.value}>{item.climate}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Terrain</Text>
          <Text style={styles.value}>{item.terrain}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Diameter</Text>
          <Text style={styles.value}>{item.diameter} km</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Gravity</Text>
          <Text style={styles.value}>{item.gravity}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Population</Text>
          <Text style={styles.value}>{item.population}</Text>
        </View>
      </View>
    </Swipeable>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FFE81F" />
        <Text style={styles.loadingText}>Loading Planets...</Text>
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
      {netInfo.isConnected === false && <NoNetworkBanner />}
      <Image
        style={styles.heroImage}
        source={{ uri: HERO_URI }}
        placeholder={{ blurhash: BLURHASH }}
        contentFit="cover"
        transition={400}
      />
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search planets..."
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
            <Text style={styles.modalTitle}>Planet</Text>
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

      <Animated.View
        style={[
          { flex: 1 },
          {
            opacity: listAnim,
            transform: [
              {
                translateY: listAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0],
                }),
              },
            ],
          },
        ]}
      >
        <ScrollView contentContainerStyle={styles.list}>
          {planets.map((item) => renderItem(item))}
        </ScrollView>
      </Animated.View>
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
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFE81F',
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
  heroImage: {
    width: '100%',
    height: 180,
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
