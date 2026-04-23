import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

const API_URL = 'https://swapi.dev/api/planets/';

export default function PlanetsScreen() {
  const [planets, setPlanets] = useState([]);
  const [nextUrl, setNextUrl] = useState(API_URL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const loadingRef = useRef(false);

  const fetchPlanets = useCallback(async (url) => {
    if (!url || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const json = await response.json();
      setPlanets((prev) => [...prev, ...json.results]);
      setNextUrl(json.next);
    } catch (err) {
      setError(err.message);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlanets(API_URL);
  }, [fetchPlanets]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.detail}>Climate: {item.climate}</Text>
      <Text style={styles.detail}>Terrain: {item.terrain}</Text>
      <Text style={styles.detail}>Population: {item.population}</Text>
    </View>
  );

  const renderFooter = () =>
    loading ? <ActivityIndicator size="large" color="#FFE81F" style={styles.loader} /> : null;

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
        data={planets}
        keyExtractor={(item) => item.url}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        onEndReached={() => fetchPlanets(nextUrl)}
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
    marginBottom: 4,
  },
  detail: {
    fontSize: 13,
    color: '#ccc',
    marginTop: 2,
  },
  loader: {
    marginVertical: 16,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
  },
});
