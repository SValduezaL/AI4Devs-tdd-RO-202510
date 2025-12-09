export interface EducationTestData {
  id?: number;
  institution?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  candidateId?: number;
}

export class EducationBuilder {
  private data: EducationTestData = {};

  static create(): EducationBuilder {
    return new EducationBuilder();
  }

  withId(id: number): EducationBuilder {
    this.data.id = id;
    return this;
  }

  withInstitution(institution: string): EducationBuilder {
    this.data.institution = institution;
    return this;
  }

  withTitle(title: string): EducationBuilder {
    this.data.title = title;
    return this;
  }

  withStartDate(startDate: string): EducationBuilder {
    this.data.startDate = startDate;
    return this;
  }

  withEndDate(endDate: string): EducationBuilder {
    this.data.endDate = endDate;
    return this;
  }

  withCandidateId(candidateId: number): EducationBuilder {
    this.data.candidateId = candidateId;
    return this;
  }

  build(): EducationTestData {
    return { ...this.data };
  }

  buildValid(): EducationTestData {
    return {
      institution: 'Universidad de Test',
      title: 'Ingeniería Informática',
      startDate: '2020-09-01',
      endDate: '2024-06-30',
      ...this.data
    };
  }
}

