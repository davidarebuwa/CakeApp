import { useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  Text,
  View,
  Button,
  Alert,
  Dimensions,
} from 'react-native';

import { fetchProducts, createCustomerAndToken } from '@/hooks/useShopify';

import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';

interface Product {
  id: string;
  title: string;
  variants: {
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
  }[];
}

const emojiMap: Record<string, string> = {
  shirt: '👕',
  bag: '👜',
  socks: '🧦',
  flip: '🩴',
  default: '🛍️',
};

function getEmojiForProduct(title: string) {
  const key = title.toLowerCase();
  if (key.includes('shirt')) return emojiMap.shirt;
  if (key.includes('bag')) return emojiMap.bag;
  if (key.includes('sock')) return emojiMap.socks;
  if (key.includes('flip')) return emojiMap.flip;
  return emojiMap.default;
}

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const CARD_MARGIN = 10;
const CARD_WIDTH = (screenWidth - CARD_MARGIN * (numColumns + 1)) / numColumns;

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => {
        console.error(err);
        Alert.alert('Error', 'Failed to fetch products');
      });
  }, []);

  const handleCreateCustomer = async () => {
    try {
      const token = await createCustomerAndToken('your.email@test.com', 'YourSecureP@ssw0rd123');
      Alert.alert('Access Token', token?.accessToken ?? 'No token returned');
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Something went wrong');
    }
  };

  const renderItem = ({ item }: { item: Product }) => {
    const emoji = getEmojiForProduct(item.title);

    return (
      <View style={styles.card}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.productTitle}>{item.title}</Text>

        <View style={styles.variantContainer}>
          {item.variants.map((variant) => (
            <View key={variant.id} style={styles.variantTag}>
              <Text style={styles.variantText}>
                {variant.title === 'Default Title' ? 'One Size' : variant.title} -{' '}
                {variant.price.amount} {variant.price.currencyCode}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={numColumns}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.welcomeRow}>
              <ThemedText type="title">Welcome to CakeShop!</ThemedText>
              <HelloWave />
            </View>
            <Text style={styles.subHeader}>🛍️ Browse Our Products</Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <Button title="Create Customer + Get Token" onPress={handleCreateCustomer} />
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  listContainer: {
    paddingHorizontal: CARD_MARGIN,
    paddingTop: 16,
    paddingBottom: 32,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: CARD_MARGIN,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: CARD_WIDTH,
    paddingVertical: 20,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderColor: '#eaeaea',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
    color: '#222',
  },
  variantContainer: {
    width: '100%',
    flexDirection: 'column',
    gap: 6,
  },
  variantTag: {
    backgroundColor: '#f5f5f5',
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  variantText: {
    fontSize: 13,
    color: '#444',
    fontWeight: '500',
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    color: '#555',
  },
  footer: {
    paddingTop: 16,
  },
});
