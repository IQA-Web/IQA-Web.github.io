export interface ImageAssessment {
  id: string;
  imageUrl: string;
  imageName: string;
  ratings: {
    overall: number;
    sharpness: number;
    brightness: number;
    contrast: number;
    colorAccuracy: number;
    noise: number;
  };
  comments: string;
  timestamp: Date;
}

export interface AssessmentCriteria {
  name: string;
  key: keyof ImageAssessment['ratings'];
  description: string;
  scale: string[];
}