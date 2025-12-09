export interface ResumeTestData {
  id?: number;
  candidateId?: number;
  filePath?: string;
  fileType?: string;
  uploadDate?: Date;
}

export class ResumeBuilder {
  private data: ResumeTestData = {};

  static create(): ResumeBuilder {
    return new ResumeBuilder();
  }

  withId(id: number): ResumeBuilder {
    this.data.id = id;
    return this;
  }

  withCandidateId(candidateId: number): ResumeBuilder {
    this.data.candidateId = candidateId;
    return this;
  }

  withFilePath(filePath: string): ResumeBuilder {
    this.data.filePath = filePath;
    return this;
  }

  withFileType(fileType: string): ResumeBuilder {
    this.data.fileType = fileType;
    return this;
  }

  withUploadDate(uploadDate: Date): ResumeBuilder {
    this.data.uploadDate = uploadDate;
    return this;
  }

  build(): ResumeTestData {
    return { ...this.data };
  }

  buildValid(): ResumeTestData {
    return {
      candidateId: 1,
      filePath: '/uploads/cv/juan-perez-cv.pdf',
      fileType: 'application/pdf',
      uploadDate: new Date(),
      ...this.data
    };
  }
}

