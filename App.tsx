import { CameraView, type BarcodeScanningResult, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  const handleBarcodeScanned = ({ data }: BarcodeScanningResult) => {
    setScannedCode(data);
  };

  const resetScan = () => {
    setScannedCode(null);
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.message}>Camera permission is required to scan EAN barcodes.</Text>
        <Button title="Allow camera" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scannedCode ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8'],
        }}
      />

      <View style={styles.resultPanel}>
        <Text style={styles.resultLabel}>Scanned barcode</Text>
        <Text style={styles.resultValue}>{scannedCode ?? 'Point camera at an EAN barcode'}</Text>
        {scannedCode ? <Button title="Scan again" onPress={resetScan} /> : null}
      </View>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
    backgroundColor: '#fff',
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  resultPanel: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 32,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  resultLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  resultValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
});