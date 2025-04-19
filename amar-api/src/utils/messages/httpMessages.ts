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
      fetchClient: {
        status_200: 'Client successfully found.',
        status_404: 'Client not found.',
      },
    },
    role: {
      createRole: {
        status_201: 'The role has successfully been created.',
        status_409: 'This role has already been registered.',
      },
      fetchRoles: {
        status_200: 'The roles have been successfully found.',
        status_404: 'No roles were found.',
      },
      fetchRole: {
        status_200: 'Role successfully found.',
        status_404: 'No role was found with the given ID.',
      },
      updateRole: {
        status_200: 'Role sucessfully updated.',
      },

      deleteRole: {
        status_200: 'Role successfully deleted.',
      },
    },
  },
};

export default HTTP_MESSAGES;
