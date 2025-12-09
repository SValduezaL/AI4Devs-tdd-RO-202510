export interface WorkExperienceTestData {
  id?: number;
  company?: string;
  position?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  candidateId?: number;
}

export class WorkExperienceBuilder {
  private data: WorkExperienceTestData = {};

  static create(): WorkExperienceBuilder {
    return new WorkExperienceBuilder();
  }

  withId(id: number): WorkExperienceBuilder {
    this.data.id = id;
    return this;
  }

  withCompany(company: string): WorkExperienceBuilder {
    this.data.company = company;
    return this;
  }

  withPosition(position: string): WorkExperienceBuilder {
    this.data.position = position;
    return this;
  }

  withDescription(description: string): WorkExperienceBuilder {
    this.data.description = description;
    return this;
  }

  withStartDate(startDate: string): WorkExperienceBuilder {
    this.data.startDate = startDate;
    return this;
  }

  withEndDate(endDate: string): WorkExperienceBuilder {
    this.data.endDate = endDate;
    return this;
  }

  withCandidateId(candidateId: number): WorkExperienceBuilder {
    this.data.candidateId = candidateId;
    return this;
  }

  build(): WorkExperienceTestData {
    return { ...this.data };
  }

  buildValid(): WorkExperienceTestData {
    return {
      company: 'Tech Company',
      position: 'Software Developer',
      description: 'Desarrollo de aplicaciones web',
      startDate: '2022-01-01',
      endDate: '2024-12-31',
      ...this.data
    };
  }
}

