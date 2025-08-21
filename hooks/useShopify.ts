import { graphqlRequest } from "@/services/shopifyApi";

interface ProductVariant {
    id: string;
    title: string;
     price: {
    id: string;
    amount: string;
    currencyCode: string;
  };
}

interface Product {
    id: string;
    title: string;
    variants: ProductVariant[];
}

interface ShopifyProductQueryResponse {
  products: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        variants: {
          edges: Array<{
            node: {
              id: string;
              title: string;
              price: {
                amount: string;
                currencyCode: string;
              };
            };
          }>;
        };
      };
    }>;
  };
}


interface Customer {
    id: string;
    email: string;
}

interface CustomerCreateResponse {
    customerCreate: {
        customer: Customer | null;
        customerUserErrors: Array<{ message: string }>;
    };
}

interface CustomerAccessToken {
    accessToken: string;
    expiresAt: string;
}

interface CustomerAccessTokenCreateResponse {
    customerAccessTokenCreate: {
        customerAccessToken: CustomerAccessToken | null;
        customerUserErrors: Array<{ message: string }>;
    };
}


export const fetchProducts = async (): Promise<Product[]> => {
    const query = `
    query {
      products(first: 5) {
        edges {
          node {
            id
            title
            variants(first: 5) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                    }
                }
              }
            }
          }
        }
      }
    }
  `;

    const data = await graphqlRequest<ShopifyProductQueryResponse>(query);

    return data.products.edges.map(({ node }) => ({
        id: node.id,
        title: node.title,
        variants: node.variants.edges.map(({ node }) => ({
            id: node.id,
            title: node.title,
            price: {
                amount: node.price.amount,
                currencyCode: node.price.currencyCode,
    },
        })),
    }));
};


export const createCustomerAndToken = async (
    email: string,
    password: string
): Promise<CustomerAccessToken | null> => {
    // Step 1: Create customer
    const customerCreateMutation = `
    mutation {
      customerCreate(input: { email: "${email}", password: "${password}" }) {
        customer {
          id
          email
        }
        customerUserErrors {
          message
        }
      }
    }
  `;

    const createResponse = await graphqlRequest<CustomerCreateResponse>(customerCreateMutation);
    const createErrors = createResponse.customerCreate.customerUserErrors;

    if (createErrors.length > 0) {
        console.error('Customer creation errors:', createErrors);
        throw new Error(createErrors.map((e) => e.message).join(', '));
    }

    console.log('Customer created:', createResponse.customerCreate.customer);

    // Step 2: Create customer access token
    const tokenCreateMutation = `
    mutation {
      customerAccessTokenCreate(input: { email: "${email}", password: "${password}" }) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          message
        }
      }
    }
  `;

    const tokenResponse = await graphqlRequest<CustomerAccessTokenCreateResponse>(tokenCreateMutation);
    const tokenErrors = tokenResponse.customerAccessTokenCreate.customerUserErrors;

    if (tokenErrors.length > 0) {
        console.error('Token creation errors:', tokenErrors);
        throw new Error(tokenErrors.map((e) => e.message).join(', '));
    }

    const token = tokenResponse.customerAccessTokenCreate.customerAccessToken;

    if (!token) {
        throw new Error('No access token returned');
    }

    return token;
};