import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

const API_URL = 'https://swapi.dev/api/starships/';

export default function SpaceshipsScreen() {
  const [ships, setShips] = useState([]);
  const [nextUrl, setNextUrl] = useState(API_URL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loadingRef = useRef(false);

  const fetchShips = useCallback(async (url) => {
    if (!url || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const json = await response.json();
      setShips((prev) => [...prev, ...json.results]);
      setNextUrl(json.next);
    } catch (err) {
      setError(err.message);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShips(API_URL);
  }, [fetchShips]);

  const renderItem = ({ item }) => (
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
  );

  if (loading && ships.length === 0) {
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
      <FlatList
        data={ships}
        keyExtractor={(item) => item.url}
        renderItem={renderItem}
        ListFooterComponent={
          loading
            ? () => <ActivityIndicator size="large" color="#FFE81F" style={styles.loader} />
            : null
        }
        onEndReached={() => fetchShips(nextUrl)}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.list}
      />
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
  loader: {
    marginVertical: 16,
  },
  loadingText: {
    color: '#ccc',
    marginTop: 10,
    fontSize: 14,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
  },
});
