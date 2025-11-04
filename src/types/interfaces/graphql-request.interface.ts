export interface GraphQLRequest {
  query: string;
  variables?: Record<string, any>;
  operationName?: string;
  testScript?: string;
  preRequestScript?: string;
}

export interface GraphQLScenario extends GraphQLRequest {
  id: string;
  name: string;
  expectedStatus: number;
  testScript?: string;
  preRequestScript?: string;
}

