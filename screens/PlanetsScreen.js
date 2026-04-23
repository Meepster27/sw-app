import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

const API_URL = 'https://swapi.info/api/planets';

export default function PlanetsScreen() {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const renderItem = ({ item }) => (
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
      <FlatList
        data={planets}
        keyExtractor={(item) => item.url}
        renderItem={renderItem}
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
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
  },
});

export default function PlanetsScreen() {
  const [planets, setPlanets] = useState([]);
  const [nextUrl, setNextUrl] = useState(API_URL);
  const [loading, setLoading] = useState(true);
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
  );

  if (loading && planets.length === 0) {
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
      <FlatList
        data={planets}
        keyExtractor={(item) => item.url}
        renderItem={renderItem}
        ListFooterComponent={
          loading
            ? () => <ActivityIndicator size="large" color="#FFE81F" style={styles.loader} />
            : null
        }
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
