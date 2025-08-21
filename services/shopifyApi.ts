import Constants from 'expo-constants';

// const { SHOP_DOMAIN, STOREFRONT_ACCESS_TOKEN } = Constants.expoConfig.extra as {
//   SHOP_DOMAIN: string;
//   STOREFRONT_ACCESS_TOKEN: string;
// };

const SHOP_DOMAIN="cake-app-dev-test-v1.myshopify.com"
const STOREFRONT_ACCESS_TOKEN="bc62a576a458b0b98f1db2a768237a9d"

// Generic GraphQL response type
interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string; [key: string]: any }>;
}

export const graphqlRequest = async <T = any>(query: string): Promise<T> => {
    console.log('env variables', SHOP_DOMAIN, STOREFRONT_ACCESS_TOKEN)
  try {
    const response = await fetch(`https://${SHOP_DOMAIN}/api/2025-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    const json: GraphQLResponse<T> = await response.json();

    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
      throw new Error(json.errors.map(e => e.message).join(', '));
    }

    if (!json.data) {
      throw new Error('No data returned from Shopify');
    }

    return json.data;
  } catch (err) {
    console.error('GraphQL request failed:', err);
    throw err;
  }
};
