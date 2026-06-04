/** Loading skeleton — animated placeholder rows. */

import { DimensionValue, StyleSheet, View } from 'react-native';

function SkeletonRow({ width }: { width: DimensionValue }) {
  return (
    <View style={styles.row}>
      <View style={styles.circle} />
      <View style={styles.lines}>
        <View style={[styles.line, { width }]} />
        <View style={[styles.line, styles.lineShort, { width: '40%' }]} />
      </View>
    </View>
  );
}

export function Skeleton() {
  return (
    <View>
      <SkeletonRow width="75%" />
      <SkeletonRow width="55%" />
      <SkeletonRow width="85%" />
      <SkeletonRow width="65%" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e2e8f0',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    marginRight: 12,
  },
  lines: {
    flex: 1,
    gap: 6,
  },
  line: {
    height: 12,
    borderRadius: 4,
    backgroundColor: '#f1f5f9',
  },
  lineShort: {
    height: 10,
  },
});
