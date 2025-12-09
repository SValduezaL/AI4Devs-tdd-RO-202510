import { Request, Response } from 'express';
import { addCandidateController } from '../presentation/controllers/candidateController';
import { addCandidate } from '../application/services/candidateService';
import { CandidateBuilder } from '../../test-utils/builders/candidateBuilder';

// Mock del servicio
jest.mock('../application/services/candidateService');

const mockAddCandidate = addCandidate as jest.MockedFunction<typeof addCandidate>;

describe('CandidateController - addCandidateController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockStatus: jest.Mock;
  let mockJson: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockStatus = jest.fn().mockReturnThis();
    mockJson = jest.fn().mockReturnThis();

    mockRequest = {
      body: {}
    };

    mockResponse = {
      status: mockStatus,
      json: mockJson
    };
  });

  describe('Happy path', () => {
    it('should return 201 and candidate data when candidate is created successfully', async () => {
      // Arrange
      const candidateData = CandidateBuilder.create().buildValid();
      const savedCandidate = { id: 1, ...candidateData };
      
      mockRequest.body = candidateData;
      mockAddCandidate.mockResolvedValue(savedCandidate as any);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockAddCandidate).toHaveBeenCalledWith(candidateData);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Candidate added successfully',
        data: savedCandidate
      });
    });

    it('should return 201 when candidate is created with minimal required fields', async () => {
      // Arrange
      const candidateData = CandidateBuilder.create().buildMinimal();
      const savedCandidate = { id: 1, ...candidateData };
      
      mockRequest.body = candidateData;
      mockAddCandidate.mockResolvedValue(savedCandidate as any);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockAddCandidate).toHaveBeenCalledWith(candidateData);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Candidate added successfully',
        data: savedCandidate
      });
    });

    it('should return 201 when candidate is created with all optional fields', async () => {
      // Arrange
      const candidateData = CandidateBuilder.create()
        .withEducations([{
          institution: 'Universidad',
          title: 'Ingeniería',
          startDate: '2020-09-01',
          endDate: '2024-06-30'
        }])
        .withWorkExperiences([{
          company: 'Tech Company',
          position: 'Developer',
          startDate: '2022-01-01'
        }])
        .withCV({
          filePath: '/path/to/cv.pdf',
          fileType: 'application/pdf'
        })
        .buildValid();
      
      const savedCandidate = { id: 1, ...candidateData };
      
      mockRequest.body = candidateData;
      mockAddCandidate.mockResolvedValue(savedCandidate as any);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockAddCandidate).toHaveBeenCalledWith(candidateData);
      expect(mockStatus).toHaveBeenCalledWith(201);
    });
  });

  describe('Error handling', () => {
    it('should return 400 when validation fails', async () => {
      // Arrange
      const invalidData = CandidateBuilder.create()
        .withFirstName('J')
        .withLastName('Pérez')
        .withEmail('test@example.com')
        .build();
      
      const validationError = new Error('Invalid name');
      
      mockRequest.body = invalidData;
      mockAddCandidate.mockRejectedValue(validationError);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockAddCandidate).toHaveBeenCalledWith(invalidData);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'Invalid name'
      });
    });

    it('should return 400 when email already exists', async () => {
      // Arrange
      const candidateData = CandidateBuilder.create().buildValid();
      const duplicateError = new Error('The email already exists in the database');
      
      mockRequest.body = candidateData;
      mockAddCandidate.mockRejectedValue(duplicateError);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'The email already exists in the database'
      });
    });

    it('should return 400 when database connection fails', async () => {
      // Arrange
      const candidateData = CandidateBuilder.create().buildValid();
      const dbError = new Error('No se pudo conectar con la base de datos');
      
      mockRequest.body = candidateData;
      mockAddCandidate.mockRejectedValue(dbError);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'No se pudo conectar con la base de datos'
      });
    });

    it('should return 400 with unknown error message when error is not an Error instance', async () => {
      // Arrange
      const candidateData = CandidateBuilder.create().buildValid();
      const unknownError = { code: 'UNKNOWN', message: 'Something went wrong' };
      
      mockRequest.body = candidateData;
      mockAddCandidate.mockRejectedValue(unknownError);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'Unknown error'
      });
    });

    it('should return 400 when email format is invalid', async () => {
      // Arrange
      const invalidData = CandidateBuilder.create()
        .withFirstName('Juan')
        .withLastName('Pérez')
        .withEmail('invalid-email')
        .build();
      
      const validationError = new Error('Invalid email');
      
      mockRequest.body = invalidData;
      mockAddCandidate.mockRejectedValue(validationError);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'Invalid email'
      });
    });

    it('should return 400 when phone format is invalid', async () => {
      // Arrange
      const invalidData = CandidateBuilder.create()
        .withFirstName('Juan')
        .withLastName('Pérez')
        .withEmail('test@example.com')
        .withPhone('512345678')
        .build();
      
      const validationError = new Error('Invalid phone');
      
      mockRequest.body = invalidData;
      mockAddCandidate.mockRejectedValue(validationError);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'Invalid phone'
      });
    });
  });
});

