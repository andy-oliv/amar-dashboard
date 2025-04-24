import { Test, TestingModule } from '@nestjs/testing';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import CreateLocationDTO from './dto/createLocationDTO';
import generateMockLocation from '../utils/mocks/generateMockLocation';
import EndpointReturn from '../interfaces/EndpointReturn';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import Location from '../interfaces/Location';
import { faker } from '@faker-js/faker/.';

describe('LocationController', () => {
  let locationController: LocationController;
  let locationService: LocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [
        {
          provide: LocationService,
          useValue: {
            createLocation: jest.fn(),
            fetchLocations: jest.fn(),
            fetchLocationsByNameOrAddress: jest.fn(),
            fetchLocation: jest.fn(),
            updateLocation: jest.fn(),
            deleteLocation: jest.fn(),
          },
        },
      ],
    }).compile();

    locationController = module.get<LocationController>(LocationController);
    locationService = module.get<LocationService>(LocationService);
  });

  it('should be defined', () => {
    expect(locationController).toBeDefined();
  });

  describe('createLocation()', () => {
    it('should create a new location', async () => {
      const locationInfo: CreateLocationDTO = generateMockLocation();
      const mockReturn: EndpointReturn = {
        message: HTTP_MESSAGES.EN.location.createLocation.status_201,
        data: locationInfo,
      };

      (locationService.createLocation as jest.Mock).mockResolvedValue(
        mockReturn,
      );

      const result: EndpointReturn =
        await locationController.createLocation(locationInfo);

      expect(locationService.createLocation).toHaveBeenCalledWith(locationInfo);
      expect(result).toMatchObject(mockReturn);
    });
  });

  describe('fetchLocations()', () => {
    it('should fetch all roles in the database', async () => {
      const locations: Location[] = [
        generateMockLocation(),
        generateMockLocation(),
      ];
      const mockReturn: EndpointReturn = {
        message: HTTP_MESSAGES.EN.location.fetchLocations.status_200,
        data: locations,
      };

      (locationService.fetchLocations as jest.Mock).mockResolvedValue(
        mockReturn,
      );

      const result: EndpointReturn = await locationController.fetchLocations();

      expect(locationService.fetchLocations).toHaveBeenCalled();
      expect(result).toMatchObject(mockReturn);
    });
  });

  describe('fetchLocationsByNameOrAddress()', () => {
    it('should fetch locations', async () => {
      const name: string = faker.person.firstName();
      const address: string = faker.location.streetAddress();
      const locations: Location[] = [
        generateMockLocation(),
        generateMockLocation(),
      ];
      const mockReturn: EndpointReturn = {
        message:
          HTTP_MESSAGES.EN.location.fetchLocationsByNameOrAddress.status_200,
        data: locations,
      };

      (
        locationService.fetchLocationsByNameOrAddress as jest.Mock
      ).mockResolvedValue(mockReturn);

      const result: EndpointReturn =
        await locationController.fetchLocationsByNameOrAddress({
          name,
          address,
        });

      expect(locationService.fetchLocationsByNameOrAddress).toHaveBeenCalled();
      expect(result).toMatchObject(mockReturn);
    });
  });

  describe('fetchLocation()', () => {
    it('should fetch a location', async () => {
      const location: Location = generateMockLocation();
      const mockReturn: EndpointReturn = {
        message: HTTP_MESSAGES.EN.location.fetchLocation.status_200,
        data: location,
      };

      (locationService.fetchLocation as jest.Mock).mockResolvedValue(
        mockReturn,
      );

      const result: EndpointReturn = await locationController.fetchLocation(
        location.id,
      );

      expect(locationService.fetchLocation).toHaveBeenCalledWith(location.id);
      expect(result).toMatchObject(mockReturn);
    });
  });

  describe('updateLocation()', () => {
    it('should update a location', async () => {
      const updatedLocation: Location = generateMockLocation();
      const mockReturn: EndpointReturn = {
        message: HTTP_MESSAGES.EN.role.updateRole.status_200,
        data: updatedLocation,
      };

      (locationService.updateLocation as jest.Mock).mockResolvedValue(
        mockReturn,
      );

      const result: EndpointReturn = await locationController.updateLocation(
        updatedLocation.id,
        updatedLocation,
      );

      expect(locationService.updateLocation).toHaveBeenCalledWith(
        updatedLocation,
      );
      expect(result).toMatchObject(mockReturn);
    });
  });

  describe('deleteLocation()', () => {
    it('should delete a location', async () => {
      const locationId: number = 0;
      const mockReturn: { message: string } = {
        message: HTTP_MESSAGES.EN.role.deleteRole.status_200,
      };

      (locationService.deleteLocation as jest.Mock).mockResolvedValue(
        mockReturn,
      );

      const result: { message: string } =
        await locationController.deleteLocation(locationId);

      expect(locationService.deleteLocation).toHaveBeenCalledWith(locationId);
      expect(result).toMatchObject(mockReturn);
    });
  });
});
