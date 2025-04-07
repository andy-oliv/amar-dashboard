const HTTP_MESSAGES = {
  EN: {
    generalMessages: {
      status_500:
        'An unexpected error occurred. Please check the error log for more information.',
    },
    client: {
      createClient: {
        status_201: 'Client successfully created.',
        status_409: 'This client has already been registered.',
      },
      fetchClients: {
        status_200: 'Clients successfully returned.',
        status_404: 'There are no clients to show.',
      },
    },
  },
};

export default HTTP_MESSAGES;
