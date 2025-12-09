// Builder for candidate test data

export interface CandidateTestData {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  educations?: any[];
  workExperiences?: any[];
  cv?: any;
}

export class CandidateBuilder {
  private data: CandidateTestData = {};

  static create(): CandidateBuilder {
    return new CandidateBuilder();
  }

  withId(id: number): CandidateBuilder {
    this.data.id = id;
    return this;
  }

  withFirstName(firstName: string): CandidateBuilder {
    this.data.firstName = firstName;
    return this;
  }

  withLastName(lastName: string): CandidateBuilder {
    this.data.lastName = lastName;
    return this;
  }

  withEmail(email: string): CandidateBuilder {
    this.data.email = email;
    return this;
  }

  withPhone(phone: string): CandidateBuilder {
    this.data.phone = phone;
    return this;
  }

  withAddress(address: string): CandidateBuilder {
    this.data.address = address;
    return this;
  }

  withEducations(educations: any[]): CandidateBuilder {
    this.data.educations = educations;
    return this;
  }

  withWorkExperiences(workExperiences: any[]): CandidateBuilder {
    this.data.workExperiences = workExperiences;
    return this;
  }

  withCV(cv: any): CandidateBuilder {
    this.data.cv = cv;
    return this;
  }

  build(): CandidateTestData {
    return { ...this.data };
  }

  buildValid(): CandidateTestData {
    return {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678',
      address: 'Calle Falsa 123',
      ...this.data
    };
  }

  buildMinimal(): CandidateTestData {
    return {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      ...this.data
    };
  }
}

