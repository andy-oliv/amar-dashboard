import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import generateMockClient from '../utils/mocks/generateMockClients';
import Client from '../interfaces/Client';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import EndpointReturn from '../interfaces/EndpointReturn';
import { faker } from '@faker-js/faker/.';

describe('ClientController', () => {
  let clientController: ClientController;
  let clientService: ClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ClientService,
          useValue: {
            createClient: jest.fn(),
            fetchClients: jest.fn(),
            fetchClient: jest.fn(),
            fetchClientsByName: jest.fn(),
            updateClient: jest.fn(),
            deleteClient: jest.fn(),
          },
        },
      ],
      controllers: [ClientController],
    }).compile();

    clientController = module.get<ClientController>(ClientController);
    clientService = module.get<ClientService>(ClientService);
  });

  it('should be defined', () => {
    expect(clientController).toBeDefined();
  });

  describe('createClient()', () => {
    it('should create a client', async () => {
      const client: Client = generateMockClient();
      (clientService.createClient as jest.Mock).mockResolvedValue({
        message: HTTP_MESSAGES.EN.client.createClient.status_201,
        data: client,
      });

      const result: EndpointReturn =
        await clientController.createClient(client);

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.client.createClient.status_201,
        data: client,
      });

      expect(clientService.createClient).toHaveBeenCalledWith(client);
    });
  });

  describe('fetchClients()', () => {
    it('should fetch all clients', async () => {
      const clientA: Client = generateMockClient();
      const clientB: Client = generateMockClient();
      const clients: Client[] = [clientA, clientB];

      (clientService.fetchClients as jest.Mock).mockResolvedValue({
        message: HTTP_MESSAGES.EN.client.fetchClients.status_200,
        data: clients,
      });

      const result: EndpointReturn = await clientController.fetchClients();

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.client.fetchClients.status_200,
        data: clients,
      });

      expect(clientService.fetchClients).toHaveBeenCalled();
    });
  });

  describe('fetchClientsByName', () => {
    it('should fetch a client', async () => {
      const client: Client = generateMockClient();
      const clients: Client[] = [client];

      (clientService.fetchClientsByName as jest.Mock).mockResolvedValue({
        message: HTTP_MESSAGES.EN.client.fetchClientsByName.status_200,
        data: clients,
      });

      const result: EndpointReturn = await clientController.fetchClientsByName(
        client.name,
      );

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.client.fetchClientsByName.status_200,
        data: clients,
      });

      expect(clientService.fetchClientsByName).toHaveBeenCalledWith(
        client.name,
      );
    });
  });

  describe('fetchClient()', () => {
    it('should fetch a client', async () => {
      const client: Client = generateMockClient();

      (clientService.fetchClient as jest.Mock).mockResolvedValue({
        message: HTTP_MESSAGES.EN.client.fetchClient.status_200,
        data: client,
      });

      const result: EndpointReturn = await clientController.fetchClient(
        client.id,
      );

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.client.fetchClient.status_200,
        data: client,
      });

      expect(clientService.fetchClient).toHaveBeenCalledWith(client.id);
    });
  });

  describe('updateClient()', () => {
    it('should update a client', async () => {
      const client: Client = generateMockClient();
      const updatedClient: Partial<Client> = {
        id: client.id,
        name: faker.person.fullName(),
      };

      (clientService.updateClient as jest.Mock).mockResolvedValue({
        message: HTTP_MESSAGES.EN.client.updateClient.status_200,
        data: updatedClient,
      });

      const result: EndpointReturn = await clientController.updateClient(
        updatedClient.id,
        updatedClient,
      );

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.client.updateClient.status_200,
        data: updatedClient,
      });

      expect(clientService.updateClient).toHaveBeenCalledWith(updatedClient);
    });
  });

  describe('deleteClient()', () => {
    it('should delete a client', async () => {
      const client: Client = generateMockClient();

      (clientService.deleteClient as jest.Mock).mockResolvedValue({
        message: HTTP_MESSAGES.EN.client.deleteClient.status_200,
        data: client,
      });

      const result: EndpointReturn = await clientController.deleteClient(
        client.id,
      );

      expect(result).toMatchObject({
        message: HTTP_MESSAGES.EN.client.deleteClient.status_200,
        data: client,
      });

      expect(clientService.deleteClient).toHaveBeenCalledWith(client.id);
    });
  });
});
