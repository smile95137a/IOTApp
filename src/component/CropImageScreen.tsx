import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PinchGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { captureRef } from 'react-native-view-shot';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CropImageScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const imageUri = route.params?.uri;
  const from = route.params?.from || 'AddBanner';
  const aspectRatio = route.params?.aspectRatio || [16, 9];
  const isCircle = route.params?.isCircle || false;

  const CROP_WIDTH = SCREEN_WIDTH;
  const CROP_HEIGHT = (CROP_WIDTH * aspectRatio[1]) / aspectRatio[0];

  const viewShotRef = useRef(null);

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastScale = useSharedValue(1);
  const lastTranslateX = useSharedValue(0);
  const lastTranslateY = useSharedValue(0);

  const [imageSize, setImageSize] = useState({
    width: CROP_WIDTH,
    height: CROP_HEIGHT,
  });

  useEffect(() => {
    if (imageUri) {
      Image.getSize(imageUri, (w, h) => {
        const ratio = Math.min(CROP_WIDTH / w, CROP_HEIGHT / h);
        const scaledWidth = w * ratio;
        const scaledHeight = h * ratio;

        setImageSize({ width: scaledWidth, height: scaledHeight });

        translateX.value = (CROP_WIDTH - scaledWidth) / 2;
        translateY.value = (CROP_HEIGHT - scaledHeight) / 2;
        lastTranslateX.value = translateX.value;
        lastTranslateY.value = translateY.value;
      });
    }
  }, [imageUri]);

  const pinchGesture = useAnimatedGestureHandler({
    onStart: () => {
      lastScale.value = scale.value;
    },
    onActive: (event) => {
      scale.value = lastScale.value * event.scale;
    },
  });

  const panGesture = useAnimatedGestureHandler({
    onStart: () => {
      lastTranslateX.value = translateX.value;
      lastTranslateY.value = translateY.value;
    },
    onActive: (event) => {
      translateX.value = lastTranslateX.value + event.translationX;
      translateY.value = lastTranslateY.value + event.translationY;
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const handleCrop = async () => {
    try {
      const uri = await captureRef(viewShotRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      const fromTab = from?.tab;
      const fromStack = from?.stack;
      const fromScreen = from?.screen;

      const originalParams = route.params || {};

      const returnParams = {
        ...originalParams,
        croppedImageUri: uri,
      };

      if (fromTab && fromStack && fromScreen) {
        (navigation as any).navigate(fromTab, {
          screen: fromStack,
          params: {
            screen: fromScreen,
            params: returnParams,
          },
        });
      } else if (fromTab && fromStack) {
        (navigation as any).navigate(fromTab, {
          screen: fromStack,
          params: returnParams,
        });
      } else {
        (navigation as any).goBack();
      }
    } catch (error: any) {
      if (error.isAutoLogout) return;
      console.warn('截圖失敗:', error);
    }
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.container}>
        <View style={{ position: 'relative' }}>
          <View
            style={[
              styles.cropArea,
              { width: CROP_WIDTH, height: CROP_HEIGHT },
            ]}
            ref={viewShotRef}
            collapsable={false}
          >
            <PinchGestureHandler onGestureEvent={pinchGesture}>
              <Animated.View
                style={{
                  width: CROP_WIDTH,
                  height: CROP_HEIGHT,
                  overflow: 'hidden',
                }}
              >
                <PanGestureHandler onGestureEvent={panGesture}>
                  <Animated.View style={[animatedStyle]}>
                    <Image
                      source={{ uri: imageUri }}
                      style={{
                        width: imageSize.width,
                        height: imageSize.height,
                      }}
                      resizeMode="cover"
                    />
                  </Animated.View>
                </PanGestureHandler>
              </Animated.View>
            </PinchGestureHandler>
          </View>

          {/* ✅ 白邊框移到裁切區外面，避免被截圖 */}
          <View
            style={[
              styles.frame,
              {
                width: CROP_WIDTH,
                height: CROP_HEIGHT,
                position: 'absolute',
                top: 0,
                left: 0,
                borderRadius: isCircle ? CROP_WIDTH / 2 : 0,
              },
            ]}
            pointerEvents="none"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCrop}>
          <Text style={styles.buttonText}>完成裁切</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cropArea: {
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  frame: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontSize: 18 },
});

export default CropImageScreen;
