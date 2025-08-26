export default {
  invoicing: {
    input: { target: 'openapi/invoice-management-v1.yaml' },
    output: {
      target: '../api/generated/api.ts',
      client: 'fetch',
      clean:true,
      schemas: '../api/dto',
    },
  },
};
