import React, { useState, useCallback } from 'react';
import { SafeAreaView, View, StatusBar, Text, TextInput, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import { styles } from './App.styles';

export default function App() {
  const [uri, setURI] = useState('https://arcadia-client.web.app');
  const [webViewURI, setWebViewURI] = useState(uri);

  const handleSubmit = useCallback(() => {
    setWebViewURI(uri);
  }, [uri, setWebViewURI]);

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#000000"
        />
        <View style={styles.controls}>
          <TextInput
            style={styles.textInput}
            value={uri}
            autoCompleteType="off"
            autoCorrect={false}
            onChangeText={(text) => setURI(text.toLowerCase())}
          />
          <Button
            title="Refresh"
            color="#00ff00"
            onPress={handleSubmit}
          />
        </View>
        <WebView
          source={{ uri: webViewURI }}
          originWhitelist={["*"]}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          domStorageEnabled
          allowsFullscreenVideo
          mixedContentMode="compatibility"
          dataDetectorTypes="all"
          startInLoadingState
          geolocationEnabled
          allowFileAccess
          // @ts-ignore
          useWebkit
          thirdPartyCookiesEnabled
          allowsBackForwardNavigationGestures
          allowsLinkPreview
          sharedCookiesEnabled
          renderLoading={() => (
            <Text>
              App is loading. Please wait...
            </Text>
          )}
          onError={() => (
            <Text>
              Oops! An error happen. :(
            </Text>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
