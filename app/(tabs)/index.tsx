import { useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Text,
  View,
  Button,
  Alert,
  Platform,
} from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface Product {
  id: string;
  title: string;
  variants: {
    id: string;
    title: string;
    price: string;
  }[];
}

const dummyProducts: Product[] = [
  {
    id: '1',
    title: 'Chocolate Cake',
    variants: [
      { id: '1a', title: 'Small', price: '5.99' },
      { id: '1b', title: 'Large', price: '9.99' },
    ],
  },
  {
    id: '2',
    title: 'Vanilla Cupcake',
    variants: [
      { id: '2a', title: 'Box of 6', price: '4.99' },
      { id: '2b', title: 'Box of 12', price: '8.99' },
    ],
  },
];

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setProducts(dummyProducts);
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  const handleCreateCustomer = () => {
    Alert.alert('Create Customer', 'Dummy button pressed');
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.productContainer}>
      <Text style={styles.productTitle}>{item.title}</Text>
      {item.variants.map((variant) => (
        <Text key={variant.id} style={styles.variant}>
          {variant.title} — ${variant.price}
        </Text>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome!</ThemedText>
          <HelloWave />
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">🧁 Dummy Products</ThemedText>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            scrollEnabled={false}
            contentContainerStyle={styles.flatListContent}
          />
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <Button title="Create Customer + Get Token" onPress={handleCreateCustomer} />
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  stepContainer: {
    marginBottom: 24,
  },
  productContainer: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  productTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 4,
  },
  variant: {
    fontSize: 15,
    marginLeft: 12,
  },
  flatListContent: {
    paddingBottom: 8,
  },
});
