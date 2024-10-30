import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const SkeletonLoaderDocument = () => {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration: 1500, // Increased duration for a slower shimmer effect
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

  const renderSkeletonFolder = () => (
    <View style={styles.folder}>
      <View style={styles.skeletonIcon}>
        <Animated.View style={[styles.shimmerOverlay, shimmerAnimation]} />
      </View>
      <View style={styles.skeletonFolderText}>
        <Animated.View style={[styles.shimmerOverlay, shimmerAnimation]} />
      </View>
      <View style={styles.skeletonChevron}>
        <Animated.View style={[styles.shimmerOverlay, shimmerAnimation]} />
      </View>
    </View>
  );

  const renderSkeletonImages = () => (
    <View style={styles.imageContainer}>
      {[...Array(3)].map((_, index) => (
        <View key={index} style={styles.imageWrapper}>
          <View style={styles.skeletonImage}>
            <Animated.View style={[styles.shimmerOverlay, shimmerAnimation]} />
          </View>
          <View style={styles.imageDetails}>
            <View style={styles.skeletonImageDescription}>
              <Animated.View style={[styles.shimmerOverlay, shimmerAnimation]} />
            </View>
            <View style={styles.skeletonImageDate}>
              <Animated.View style={[styles.shimmerOverlay, shimmerAnimation]} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderSkeletonFolder()}
      {renderSkeletonImages()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  folder: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skeletonIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    overflow: 'hidden',
  },
  skeletonFolderText: {
    flex: 1,
    height: 20,
    backgroundColor: '#2A2A2A',
    marginLeft: 10,
    borderRadius: 4,
    overflow: 'hidden',
  },
  skeletonChevron: {
    width: 24,
    height: 24,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageContainer: {
    marginTop: 10,
  },
  imageWrapper: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonImage: {
    width: 50,
    height: 50,
    backgroundColor: '#2A2A2A',
    borderRadius: 5,
    overflow: 'hidden',
  },
  imageDetails: {
    marginLeft: 10,
    flex: 1,
  },
  skeletonImageDescription: {
    width: '70%',
    height: 14,
    backgroundColor: '#2A2A2A',
    borderRadius: 4,
    marginBottom: 5,
    overflow: 'hidden',
  },
  skeletonImageDate: {
    width: '50%',
    height: 12,
    backgroundColor: '#2A2A2A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  shimmerOverlay: {
    width: '200%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default SkeletonLoaderDocument;
