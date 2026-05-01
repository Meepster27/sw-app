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

const HERO_URI = 'https://images.unsplash.com/photo-1518364538800-6bae3c2ea0f2?w=800';

const BLURHASH = 'L03~Wt00IU~q00~q%M%M_3D%WB-;';

const API_URL = 'https://swapi.info/api/starships';

export default function SpaceshipsScreen() {
  const netInfo = useNetInfo();
  const [ships, setShips] = useState([]);
  const listAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [swipeModalVisible, setSwipeModalVisible] = useState(false);
  const [swipeItem, setSwipeItem] = useState(null);
  const [filmTitleMap, setFilmTitleMap] = useState({});
  const [filmEpisodeMap, setFilmEpisodeMap] = useState({});

  useEffect(() => {
    fetch('https://swapi.info/api/films')
      .then((res) => res.json())
      .then((data) => {
        const map = {};
        const epMap = {};
        data.forEach((f) => {
          const id = f.url.match(/(\d+)\/?$/)?.[1];
          if (id) {
            map[id] = f.title;
            epMap[id] = String(f.episode_id);
          }
        });
        setFilmTitleMap(map);
        setFilmEpisodeMap(epMap);
      })
      .catch(() => {});
  }, []);

  const getFilmId = (url) => url.match(/(\d+)\/?$/)?.[1];

  const filteredShips = ships.filter((s) => {
    const q = searchText.toLowerCase();
    const inFilm = s.films?.some((url) => {
      const id = getFilmId(url);
      return (
        filmTitleMap[id]?.toLowerCase().includes(q) ||
        filmEpisodeMap[id]?.includes(q)
      );
    });
    return (
      s.name.toLowerCase().includes(q) ||
      s.model.toLowerCase().includes(q) ||
      s.starship_class.toLowerCase().includes(q) ||
      s.manufacturer.toLowerCase().includes(q) ||
      inFilm
    );
  });

  const handleSearch = () => {};

  const handleSwipe = (item) => {
    setSwipeItem(item);
    setSwipeModalVisible(true);
  };

  const renderRightAction = (item) => {
    const titles = (item.films || []).map((url) => {
      const id = url.match(/(\d+)\/?$/)?.[1];
      return filmTitleMap[id];
    }).filter(Boolean);
    return (
      <View style={styles.swipeAction}>
        <Text style={styles.swipeActionText}>View</Text>
      </View>
    );
  };

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => setShips(data))
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
  }, [loading, listAnim]);

  const renderItem = (item) => (
    <Swipeable
      key={item.url}
      renderRightActions={() => renderRightAction(item)}
      onSwipeableOpen={() => handleSwipe(item)}
    >
      <View style={styles.card}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.model}>{item.model}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Class</Text>
          <Text style={styles.value}>{item.starship_class}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Manufacturer</Text>
          <Text style={styles.value}>{item.manufacturer}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Crew</Text>
          <Text style={styles.value}>{item.crew}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Passengers</Text>
          <Text style={styles.value}>{item.passengers}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Hyperdrive</Text>
          <Text style={styles.value}>{item.hyperdrive_rating}</Text>
        </View>
      </View>
    </Swipeable>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FFE81F" />
        <Text style={styles.loadingText}>Loading Spaceships...</Text>
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
          placeholder="Search spaceships..."
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity style={styles.searchButton} onPress={() => setSearchText('')}>
            <Text style={styles.searchButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={swipeModalVisible}
        onRequestClose={() => setSwipeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{swipeItem?.name}</Text>
            <Text style={styles.modalFilmsLabel}>Appears in:</Text>
            {(swipeItem?.films || []).map((url) => {
              const id = url.match(/(\d+)\/?$/)?.[1];
              const title = filmTitleMap[id];
              return title ? (
                <Text key={url} style={styles.modalFilmItem}>{title}</Text>
              ) : null;
            })}
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
          {filteredShips.length === 0 && searchText.length > 0 ? (
            <Text style={styles.noResults}>No spaceships match "{searchText}"</Text>
          ) : (
            filteredShips.map((item) => renderItem(item))
          )}
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
    marginBottom: 2,
  },
  model: {
    fontSize: 13,
    color: '#aaa',
    fontStyle: 'italic',
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
  filmsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  filmChip: {
    backgroundColor: '#0f3460',
    color: '#FFE81F',
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    overflow: 'hidden',
  },
  noResults: {
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
    fontStyle: 'italic',
  },
  swipeAction: {
    backgroundColor: '#e63946',
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    marginBottom: 10,
    borderRadius: 8,
    padding: 8,
  },
  swipeActionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  swipeFilmText: {
    color: '#ffd0d0',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
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
  modalFilmsLabel: {
    color: '#888',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  modalFilmItem: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 6,
    textAlign: 'center',
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
