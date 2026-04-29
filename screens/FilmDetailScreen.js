import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function InfoRow({ label, value }) {
  if (!value || value === 'unknown' || value === 'n/a') return null;
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function StatBadge({ label, count }) {
  if (!count) return null;
  return (
    <View style={styles.statBadge}>
      <Text style={styles.statCount}>{count}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SectionHeader({ title }) {
  return (
    <View style={styles.sectionHeaderRow}>
      <View style={styles.sectionLine} />
      <Text style={styles.sectionHeaderText}>{title}</Text>
      <View style={styles.sectionLine} />
    </View>
  );
}

export default function FilmDetailScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { film } = route.params;

  const formattedCrawl = film.opening_crawl
    ? film.opening_crawl.replace(/\r\n/g, '\n').trim()
    : '';

  const formattedDate = film.release_date
    ? new Date(film.release_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : film.release_date;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Custom back header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backChevron}>‹</Text>
          <Text style={styles.backLabel}>Films</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {film.title}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero episode block */}
        <View style={styles.heroBlock}>
          <View style={styles.episodePill}>
            <Text style={styles.episodePillText}>
              EPISODE {toRoman(film.episode_id)} · {film.episode_id}
            </Text>
          </View>
          <Text style={styles.heroTitle}>{film.title}</Text>
          <Text style={styles.heroSub}>
            Directed by {film.director}
          </Text>
        </View>

        {/* Opening crawl */}
        <View style={styles.crawlCard}>
          <View style={styles.crawlStars}>
            <Text style={styles.crawlStarDot}>?</Text>
            <Text style={styles.crawlStarDot}>?</Text>
            <Text style={styles.crawlStarDot}>?</Text>
          </View>
          <Text style={styles.crawlText}>{formattedCrawl}</Text>
          <View style={styles.crawlStars}>
            <Text style={styles.crawlStarDot}>?</Text>
            <Text style={styles.crawlStarDot}>?</Text>
            <Text style={styles.crawlStarDot}>?</Text>
          </View>
        </View>

        {/* Production details */}
        <SectionHeader title="Production" />
        <View style={styles.infoCard}>
          <InfoRow label="Director" value={film.director} />
          <InfoRow label="Producer" value={film.producer} />
          <InfoRow label="Release Date" value={formattedDate} />
        </View>

        {/* Universe stats */}
        <SectionHeader title="Universe" />
        <View style={styles.statsGrid}>
          <StatBadge label="Characters" count={film.characters?.length} />
          <StatBadge label="Planets" count={film.planets?.length} />
          <StatBadge label="Starships" count={film.starships?.length} />
          <StatBadge label="Vehicles" count={film.vehicles?.length} />
          <StatBadge label="Species" count={film.species?.length} />
        </View>
      </ScrollView>
    </View>
  );
}

function toRoman(num) {
  const map = [
    [6, 'VI'], [5, 'V'], [4, 'IV'], [3, 'III'], [2, 'II'], [1, 'I'],
  ];
  for (const [n, r] of map) {
    if (num >= n) return r;
  }
  return String(num);
}

const YELLOW = '#FFE81F';
const DARK_BG = '#1a1a2e';
const CARD_BG = '#16213e';
const DEEP = '#0f3460';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: CARD_BG,
    borderBottomWidth: 1,
    borderBottomColor: YELLOW,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 70,
  },
  backChevron: {
    color: YELLOW,
    fontSize: 30,
    lineHeight: 30,
    marginRight: 2,
    marginTop: -2,
  },
  backLabel: {
    color: YELLOW,
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSpacer: {
    minWidth: 70,
  },

  scroll: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },

  /* Hero block */
  heroBlock: {
    alignItems: 'center',
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  episodePill: {
    backgroundColor: YELLOW,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 12,
  },
  episodePillText: {
    color: DARK_BG,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: YELLOW,
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
    lineHeight: 38,
  },
  heroSub: {
    color: '#aaa',
    fontSize: 15,
    fontStyle: 'italic',
  },

  /* Crawl card */
  crawlCard: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  crawlStars: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 8,
  },
  crawlStarDot: {
    color: YELLOW,
    fontSize: 10,
    opacity: 0.6,
  },
  crawlText: {
    color: '#c8c8c8',
    fontSize: 14,
    lineHeight: 24,
    fontStyle: 'italic',
    textAlign: 'justify',
  },

  /* Section header */
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2a2a4a',
  },
  sectionHeaderText: {
    color: YELLOW,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  /* Info card */
  infoCard: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e1e3a',
  },
  infoLabel: {
    color: '#888',
    fontSize: 14,
    flex: 1,
  },
  infoValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },

  /* Stats grid */
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statBadge: {
    backgroundColor: DEEP,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a4a',
    minWidth: '28%',
    flex: 1,
  },
  statCount: {
    color: YELLOW,
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 32,
  },
  statLabel: {
    color: '#888',
    fontSize: 11,
    marginTop: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
