import { validateCandidateData } from '../application/validator';
import { addCandidate } from '../application/services/candidateService';
import { Candidate } from '../domain/models/Candidate';
import { Education } from '../domain/models/Education';
import { WorkExperience } from '../domain/models/WorkExperience';
import { Resume } from '../domain/models/Resume';
import { CandidateBuilder } from '../../test-utils/builders/candidateBuilder';
import { EducationBuilder } from '../../test-utils/builders/educationBuilder';
import { WorkExperienceBuilder } from '../../test-utils/builders/workExperienceBuilder';
import { ResumeBuilder } from '../../test-utils/builders/resumeBuilder';

// Mock de los modelos antes de importar el servicio
jest.mock('../domain/models/Candidate');
jest.mock('../domain/models/Education');
jest.mock('../domain/models/WorkExperience');
jest.mock('../domain/models/Resume');

describe('CandidateService - addCandidate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Validación de datos del formulario', () => {
    describe('validateCandidateData', () => {
      it('should validate candidate data when all required fields are valid', () => {
        // Arrange
        const validData = CandidateBuilder.create().buildValid();

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });

      it('should throw error when firstName is missing', () => {
        // Arrange
        const invalidData = CandidateBuilder.create()
          .withLastName('Pérez')
          .withEmail('test@example.com')
          .build();

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid name');
      });

      it('should throw error when firstName is less than 2 characters', () => {
        // Arrange
        const invalidData = CandidateBuilder.create()
          .withFirstName('J')
          .withLastName('Pérez')
          .withEmail('test@example.com')
          .build();

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid name');
      });

      it('should throw error when firstName is more than 100 characters', () => {
        // Arrange
        const longName = 'A'.repeat(101);
        const invalidData = CandidateBuilder.create()
          .withFirstName(longName)
          .withLastName('Pérez')
          .withEmail('test@example.com')
          .build();

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid name');
      });

      it('should throw error when firstName contains invalid characters', () => {
        // Arrange
        const invalidData = CandidateBuilder.create()
          .withFirstName('Juan123')
          .withLastName('Pérez')
          .withEmail('test@example.com')
          .build();

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid name');
      });

      it('should throw error when lastName is missing', () => {
        // Arrange
        const invalidData = CandidateBuilder.create()
          .withFirstName('Juan')
          .withEmail('test@example.com')
          .build();

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid name');
      });

      it('should throw error when email is missing', () => {
        // Arrange
        const invalidData = CandidateBuilder.create()
          .withFirstName('Juan')
          .withLastName('Pérez')
          .build();

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid email');
      });

      it('should throw error when email format is invalid', () => {
        // Arrange
        const invalidData = CandidateBuilder.create()
          .withFirstName('Juan')
          .withLastName('Pérez')
          .withEmail('invalid-email')
          .build();

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid email');
      });

      it('should throw error when phone format is invalid (not starting with 6, 7 or 9)', () => {
        // Arrange
        const invalidData = CandidateBuilder.create()
          .withFirstName('Juan')
          .withLastName('Pérez')
          .withEmail('test@example.com')
          .withPhone('512345678')
          .build();

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid phone');
      });

      it('should throw error when phone has wrong length', () => {
        // Arrange
        const invalidData = CandidateBuilder.create()
          .withFirstName('Juan')
          .withLastName('Pérez')
          .withEmail('test@example.com')
          .withPhone('61234567')
          .build();

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid phone');
      });

      it('should accept valid phone starting with 6', () => {
        // Arrange
        const validData = CandidateBuilder.create()
          .withFirstName('Juan')
          .withLastName('Pérez')
          .withEmail('test@example.com')
          .withPhone('612345678')
          .build();

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });

      it('should accept valid phone starting with 7', () => {
        // Arrange
        const validData = CandidateBuilder.create()
          .withFirstName('Juan')
          .withLastName('Pérez')
          .withEmail('test@example.com')
          .withPhone('712345678')
          .build();

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });

      it('should accept valid phone starting with 9', () => {
        // Arrange
        const validData = CandidateBuilder.create()
          .withFirstName('Juan')
          .withLastName('Pérez')
          .withEmail('test@example.com')
          .withPhone('912345678')
          .build();

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });

      it('should throw error when address is more than 100 characters', () => {
        // Arrange
        const longAddress = 'A'.repeat(101);
        const invalidData = CandidateBuilder.create()
          .withFirstName('Juan')
          .withLastName('Pérez')
          .withEmail('test@example.com')
          .withAddress(longAddress)
          .build();

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid address');
      });

      it('should validate education when provided', () => {
        // Arrange
        const validEducation = EducationBuilder.create().buildValid();
        const validData = CandidateBuilder.create()
          .withEducations([validEducation])
          .buildValid();

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });

      it('should throw error when education institution is missing', () => {
        // Arrange
        const invalidEducation = EducationBuilder.create()
          .withTitle('Ingeniería')
          .withStartDate('2020-09-01')
          .build();
        const invalidData = CandidateBuilder.create()
          .withEducations([invalidEducation])
          .buildValid();

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid institution');
      });

      it('should throw error when education institution is more than 100 characters', () => {
        // Arrange
        const longInstitution = 'A'.repeat(101);
        const invalidEducation = EducationBuilder.create()
          .withInstitution(longInstitution)
          .withTitle('Ingeniería')
          .withStartDate('2020-09-01')
          .build();
        const invalidData = CandidateBuilder.create()
          .withEducations([invalidEducation])
          .buildValid();

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid institution');
      });

      it('should throw error when education title is missing', () => {
        // Arrange
        const invalidEducation = EducationBuilder.create()
          .withInstitution('Universidad')
          .withStartDate('2020-09-01')
          .build();
        const invalidData = CandidateBuilder.create()
          .withEducations([invalidEducation])
          .buildValid();

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid title');
      });

      it('should throw error when education startDate is invalid format', () => {
        // Arrange
        const invalidEducation = EducationBuilder.create()
          .withInstitution('Universidad')
          .withTitle('Ingeniería')
          .withStartDate('01-09-2020')
          .build();
        const invalidData = CandidateBuilder.create()
          .withEducations([invalidEducation])
          .buildValid();

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid date');
      });

      it('should throw error when education endDate is invalid format', () => {
        // Arrange
        const invalidEducation = EducationBuilder.create()
          .withInstitution('Universidad')
          .withTitle('Ingeniería')
          .withStartDate('2020-09-01')
          .withEndDate('30-06-2024')
          .build();
        const invalidData = CandidateBuilder.create()
          .withEducations([invalidEducation])
          .buildValid();

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid end date');
      });

      it('should validate work experience when provided', () => {
        // Arrange
        const validExperience = WorkExperienceBuilder.create().buildValid();
        const validData = CandidateBuilder.create()
          .withWorkExperiences([validExperience])
          .buildValid();

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });

      it('should throw error when work experience company is missing', () => {
        // Arrange
        const invalidExperience = WorkExperienceBuilder.create()
          .withPosition('Developer')
          .withStartDate('2022-01-01')
          .build();
        const invalidData = CandidateBuilder.create()
          .withWorkExperiences([invalidExperience])
          .buildValid();

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid company');
      });

      it('should throw error when work experience position is missing', () => {
        // Arrange
        const invalidExperience = WorkExperienceBuilder.create()
          .withCompany('Tech Company')
          .withStartDate('2022-01-01')
          .build();
        const invalidData = CandidateBuilder.create()
          .withWorkExperiences([invalidExperience])
          .buildValid();

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid position');
      });

      it('should throw error when work experience description is more than 200 characters', () => {
        // Arrange
        const longDescription = 'A'.repeat(201);
        const invalidExperience = WorkExperienceBuilder.create()
          .withCompany('Tech Company')
          .withPosition('Developer')
          .withDescription(longDescription)
          .withStartDate('2022-01-01')
          .build();
        const invalidData = CandidateBuilder.create()
          .withWorkExperiences([invalidExperience])
          .buildValid();

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid description');
      });

      it('should throw error when work experience startDate is invalid format', () => {
        // Arrange
        const invalidExperience = WorkExperienceBuilder.create()
          .withCompany('Tech Company')
          .withPosition('Developer')
          .withStartDate('01-01-2022')
          .build();
        const invalidData = CandidateBuilder.create()
          .withWorkExperiences([invalidExperience])
          .buildValid();

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid date');
      });

      it('should validate CV when provided', () => {
        // Arrange
        const validCV = ResumeBuilder.create().buildValid();
        const validData = CandidateBuilder.create()
          .withCV(validCV)
          .buildValid();

        // Act & Assert
        expect(() => validateCandidateData(validData)).not.toThrow();
      });

      it('should throw error when CV filePath is missing', () => {
        // Arrange
        const invalidCV = {
          fileType: 'application/pdf'
        };
        const invalidData = CandidateBuilder.create()
          .withCV(invalidCV)
          .buildValid();

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid CV data');
      });

      it('should throw error when CV fileType is missing', () => {
        // Arrange
        const invalidCV = {
          filePath: '/path/to/file.pdf'
        };
        const invalidData = CandidateBuilder.create()
          .withCV(invalidCV)
          .buildValid();

        // Act & Assert
        expect(() => validateCandidateData(invalidData)).toThrow('Invalid CV data');
      });

      it('should not validate when id is provided (edit mode)', () => {
        // Arrange
        const dataWithId = CandidateBuilder.create()
          .withId(1)
          .build();

        // Act & Assert
        expect(() => validateCandidateData(dataWithId)).not.toThrow();
      });
    });
  });

  describe('Guardado en base de datos', () => {
    describe('addCandidate service', () => {
      it('should create candidate with all related data when data is valid', async () => {
        // Arrange
        const educationData = EducationBuilder.create().buildValid();
        const experienceData = WorkExperienceBuilder.create().buildValid();
        const cvData = ResumeBuilder.create().buildValid();
        
        const candidateData = CandidateBuilder.create()
          .withEducations([educationData])
          .withWorkExperiences([experienceData])
          .withCV(cvData)
          .buildValid();

        const savedCandidate = { id: 1, ...candidateData };
        const savedEducation = { id: 1, candidateId: 1, ...educationData };
        const savedExperience = { id: 1, candidateId: 1, ...experienceData };
        const savedResume = { id: 1, candidateId: 1, ...cvData };

        // Mock Candidate model
        const mockCandidateInstance = {
          save: jest.fn().mockResolvedValue(savedCandidate),
          education: [],
          workExperience: [],
          resumes: []
        };

        // Mock Education model
        const mockEducationInstance = {
          save: jest.fn().mockResolvedValue(savedEducation),
          candidateId: 1
        };

        // Mock WorkExperience model
        const mockExperienceInstance = {
          save: jest.fn().mockResolvedValue(savedExperience),
          candidateId: 1
        };

        // Mock Resume model
        const mockResumeInstance = {
          save: jest.fn().mockResolvedValue(savedResume),
          candidateId: 1
        };

        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);
        (Education as jest.MockedClass<typeof Education>).mockImplementation(() => mockEducationInstance as any);
        (WorkExperience as jest.MockedClass<typeof WorkExperience>).mockImplementation(() => mockExperienceInstance as any);
        (Resume as jest.MockedClass<typeof Resume>).mockImplementation(() => mockResumeInstance as any);

        // Act
        const result = await addCandidate(candidateData);

        // Assert
        expect(result).toEqual(savedCandidate);
        expect(mockCandidateInstance.save).toHaveBeenCalled();
        expect(mockEducationInstance.save).toHaveBeenCalled();
        expect(mockExperienceInstance.save).toHaveBeenCalled();
        expect(mockResumeInstance.save).toHaveBeenCalled();
      });

      it('should create candidate without optional data when only required fields are provided', async () => {
        // Arrange
        const candidateData = CandidateBuilder.create().buildMinimal();
        const savedCandidate = { id: 1, ...candidateData };

        // Mock Candidate model
        const mockCandidateInstance = {
          save: jest.fn().mockResolvedValue(savedCandidate),
          education: [],
          workExperience: [],
          resumes: []
        };

        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act
        const result = await addCandidate(candidateData);

        // Assert
        expect(result).toEqual(savedCandidate);
        expect(mockCandidateInstance.save).toHaveBeenCalled();
      });

      it('should throw error when validation fails', async () => {
        // Arrange
        const invalidData = CandidateBuilder.create()
          .withFirstName('J')
          .withLastName('Pérez')
          .withEmail('test@example.com')
          .build();

        // Act & Assert
        await expect(addCandidate(invalidData)).rejects.toThrow('Invalid name');
      });

      it('should throw error when email already exists', async () => {
        // Arrange
        const candidateData = CandidateBuilder.create().buildValid();
        const prismaError = {
          code: 'P2002',
          meta: { target: ['email'] }
        };

        // Mock Candidate model to throw P2002 error
        const mockCandidateInstance = {
          save: jest.fn().mockRejectedValue(prismaError),
          education: [],
          workExperience: [],
          resumes: []
        };

        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act & Assert
        await expect(addCandidate(candidateData)).rejects.toThrow('The email already exists in the database');
      });

      it('should propagate other database errors', async () => {
        // Arrange
        const candidateData = CandidateBuilder.create().buildValid();
        const dbError = new Error('Database connection lost');

        // Mock Candidate model to throw error
        const mockCandidateInstance = {
          save: jest.fn().mockRejectedValue(dbError),
          education: [],
          workExperience: [],
          resumes: []
        };

        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);

        // Act & Assert
        await expect(addCandidate(candidateData)).rejects.toThrow('Database connection lost');
      });

      it('should create candidate with multiple educations', async () => {
        // Arrange
        const education1 = EducationBuilder.create().buildValid();
        const education2 = EducationBuilder.create()
          .withInstitution('Otra Universidad')
          .withTitle('Máster')
          .withStartDate('2024-09-01')
          .build();

        const candidateData = CandidateBuilder.create()
          .withEducations([education1, education2])
          .buildValid();

        const savedCandidate = { id: 1, ...candidateData };
        const savedEducation1 = { id: 1, candidateId: 1, ...education1 };
        const savedEducation2 = { id: 2, candidateId: 1, ...education2 };

        // Mock Candidate model
        const mockCandidateInstance = {
          save: jest.fn().mockResolvedValue(savedCandidate),
          education: [],
          workExperience: [],
          resumes: []
        };

        // Mock Education models
        const mockEducation1 = {
          save: jest.fn().mockResolvedValue(savedEducation1),
          candidateId: 1
        };

        const mockEducation2 = {
          save: jest.fn().mockResolvedValue(savedEducation2),
          candidateId: 1
        };

        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);
        (Education as jest.MockedClass<typeof Education>)
          .mockImplementationOnce(() => mockEducation1 as any)
          .mockImplementationOnce(() => mockEducation2 as any);

        // Act
        const result = await addCandidate(candidateData);

        // Assert
        expect(result).toEqual(savedCandidate);
        expect(mockEducation1.save).toHaveBeenCalled();
        expect(mockEducation2.save).toHaveBeenCalled();
      });

      it('should create candidate with multiple work experiences', async () => {
        // Arrange
        const experience1 = WorkExperienceBuilder.create().buildValid();
        const experience2 = WorkExperienceBuilder.create()
          .withCompany('Otra Empresa')
          .withPosition('Senior Developer')
          .withStartDate('2023-01-01')
          .build();

        const candidateData = CandidateBuilder.create()
          .withWorkExperiences([experience1, experience2])
          .buildValid();

        const savedCandidate = { id: 1, ...candidateData };
        const savedExperience1 = { id: 1, candidateId: 1, ...experience1 };
        const savedExperience2 = { id: 2, candidateId: 1, ...experience2 };

        // Mock Candidate model
        const mockCandidateInstance = {
          save: jest.fn().mockResolvedValue(savedCandidate),
          education: [],
          workExperience: [],
          resumes: []
        };

        // Mock WorkExperience models
        const mockExperience1 = {
          save: jest.fn().mockResolvedValue(savedExperience1),
          candidateId: 1
        };

        const mockExperience2 = {
          save: jest.fn().mockResolvedValue(savedExperience2),
          candidateId: 1
        };

        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);
        (WorkExperience as jest.MockedClass<typeof WorkExperience>)
          .mockImplementationOnce(() => mockExperience1 as any)
          .mockImplementationOnce(() => mockExperience2 as any);

        // Act
        const result = await addCandidate(candidateData);

        // Assert
        expect(result).toEqual(savedCandidate);
        expect(mockExperience1.save).toHaveBeenCalled();
        expect(mockExperience2.save).toHaveBeenCalled();
      });
    });
  });
});
