export default {
  invoicing: {
    input: { target: '../openapi/invoice-management-v1.yaml' },
    output: {
      target: 'api/invoicing.ts',
      mode: 'tags-split',     
      schemas: 'api/dto', 
    },
  },
};
