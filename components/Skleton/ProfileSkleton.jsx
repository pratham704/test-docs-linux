import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const SkeletonLoader = () => {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration: 1500, // Duration for slower shimmer effect
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [shimmerValue]);

  const shimmerAnimation = {
    transform: [
      {
        translateX: shimmerValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-200, 200], // Controls the shimmer movement
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* Profile Header Skeleton */}
      <View style={styles.profileHeader}>
        <View style={styles.skeletonImage}>
          <Animated.View style={[styles.shimmerOverlay, shimmerAnimation]} />
        </View>
        <View style={styles.skeletonTextLarge}>
          <Animated.View style={[styles.shimmerOverlay, shimmerAnimation]} />
        </View>
        <View style={styles.skeletonTextSmall}>
          <Animated.View style={[styles.shimmerOverlay, shimmerAnimation]} />
        </View>
      </View>

      {/* Info Section Skeleton */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <View style={styles.skeletonIcon}>
            <Animated.View style={[styles.shimmerOverlay, shimmerAnimation]} />
          </View>
          <View style={styles.skeletonTextWider}>
            <Animated.View style={[styles.shimmerOverlay, shimmerAnimation]} />
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <View style={styles.skeletonIcon}>
            <Animated.View style={[styles.shimmerOverlay, shimmerAnimation]} />
          </View>
          <View style={styles.skeletonTextWider}>
            <Animated.View style={[styles.shimmerOverlay, shimmerAnimation]} />
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <View style={styles.skeletonIcon}>
            <Animated.View style={[styles.shimmerOverlay, shimmerAnimation]} />
          </View>
          <View style={styles.skeletonTextWider}>
            <Animated.View style={[styles.shimmerOverlay, shimmerAnimation]} />
          </View>
        </View>
      </View>

      {/* Settings Section Skeleton */}
      <View style={styles.settingsSection}>
        <View style={styles.settingsRow}>
          <View style={styles.skeletonIcon}>
            <Animated.View style={[styles.shimmerOverlay, shimmerAnimation]} />
          </View>
          <View style={styles.skeletonTextWider}>
            <Animated.View style={[styles.shimmerOverlay, shimmerAnimation]} />
          </View>
        </View>
        <View style={styles.settingsRow}>
          <View style={styles.skeletonIcon}>
            <Animated.View style={[styles.shimmerOverlay, shimmerAnimation]} />
          </View>
          <View style={styles.skeletonTextWider}>
            <Animated.View style={[styles.shimmerOverlay, shimmerAnimation]} />
          </View>
        </View>
      </View>

      {/* Action Button Skeleton */}
      <View style={styles.actionButton}>
        <Animated.View style={[styles.shimmerOverlay, shimmerAnimation]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark background
    paddingHorizontal: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  skeletonImage: {
    width: 130, // Increased width for bigger profile image
    height: 130, // Increased height for bigger profile image
    borderRadius: 75, // Larger radius for circular image
    backgroundColor: "#333",
    marginBottom: 12,
    overflow: 'hidden',
  },
  skeletonTextLarge: {
    width: 220, // Increased width for wider text skeleton
    height: 26,
    backgroundColor: "#333",
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  skeletonTextSmall: {
    width: 180, // Increased width for wider text skeleton
    height: 16,
    backgroundColor: "#333",
    borderRadius: 4,
    overflow: 'hidden',
  },
  infoSection: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  skeletonIcon: {
    width: 30, // Slightly larger icon size
    height: 30,
    backgroundColor: "#333",
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  skeletonTextWider: {
    width: '90%', // Made skeleton text wider to cover more space
    height: 18,
    backgroundColor: "#333",
    borderRadius: 4,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 10,
  },
  settingsSection: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  actionButton: {
    width: '90%', // Made the button skeleton wider
    height: 50, // Slightly taller button
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  shimmerOverlay: {
    width: '200%', // Wider than the element for the shimmer effect
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Shimmer color
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default SkeletonLoader;
