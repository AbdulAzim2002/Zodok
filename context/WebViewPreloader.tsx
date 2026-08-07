import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

interface WebViewPreloaderContextType {
  isPreloaded: boolean;
  webViewRef: React.RefObject<WebView> | null;
  preloadedUrl: string;
  resetPreloader: () => void;
}

const WebViewPreloaderContext = createContext<WebViewPreloaderContextType>({
  isPreloaded: false,
  webViewRef: null,
  preloadedUrl: '',
  resetPreloader: () => {},
});

export const useWebViewPreloader = () => useContext(WebViewPreloaderContext);

interface WebViewPreloaderProviderProps {
  children: React.ReactNode;
  url?: string;
}

export const WebViewPreloaderProvider: React.FC<WebViewPreloaderProviderProps> = ({
  children,
  url = 'https://zodok.in'
}) => {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [shouldPreload, setShouldPreload] = useState(true);
  const webViewRef = useRef<WebView>(null);
  const [preloadedUrl] = useState(url);

  const injectedJS = `
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'viewport');
    meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    document.head.appendChild(meta);

    // Inject flag to identify app
    window.isZodokApp = true;

    // Send message to identify as app
    window.postMessage('ZODOK_APP_LOADED');

    // For iOS
    if (window.webkit && window.webkit.messageHandlers) {
      window.ReactNativeWebView = true;
    }

    // Preload images and resources
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.complete) {
        img.loading = 'eager';
      }
    });

    // Notify when page is fully loaded
    if (document.readyState === 'complete') {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'PAGE_LOADED' }));
    } else {
      window.addEventListener('load', () => {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'PAGE_LOADED' }));
      });
    }

    true;
  `;

  const resetPreloader = () => {
    setIsPreloaded(false);
    setShouldPreload(true);
  };

  useEffect(() => {
    // Start preloading after a short delay to not interfere with app startup
    const timer = setTimeout(() => {
      if (shouldPreload) {
        console.log('Starting WebView preload...');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [shouldPreload]);

  return (
    <WebViewPreloaderContext.Provider
      value={{
        isPreloaded,
        webViewRef: webViewRef as React.RefObject<WebView>,
        preloadedUrl,
        resetPreloader
      }}
    >
      {children}

      {/* Hidden WebView for preloading */}
      {shouldPreload && !isPreloaded && (
        <View style={{ position: 'absolute', width: 0, height: 0, opacity: 0 }}>
          <WebView
            ref={webViewRef}
            source={{ uri: preloadedUrl }}
            injectedJavaScript={injectedJS}
            startInLoadingState={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            onLoadEnd={() => {
              console.log('WebView preload completed');
              setIsPreloaded(true);
            }}
            onMessage={(event) => {
              const data = event.nativeEvent.data;
              try {
                const message = JSON.parse(data);
                if (message.type === 'PAGE_LOADED') {
                  console.log('Page fully loaded and cached');
                  setIsPreloaded(true);
                }
              } catch (e) {
                // Handle non-JSON messages
              }
            }}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView preload error:', nativeEvent);
              // Don't retry on error to avoid infinite loops
              setShouldPreload(false);
            }}
            cacheEnabled={true}
            cacheMode="LOAD_CACHE_ELSE_NETWORK"
          />
        </View>
      )}
    </WebViewPreloaderContext.Provider>
  );
};