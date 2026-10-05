import { CorrectAnswers } from "./correctAnswers";

export interface Question {
    questionID: string | null,
    questionText: string,
    displayAnswer: string,
    titleID: number | undefined,   // was titleId
    titleDescription: string,
    hasImage: boolean,
    imagePath: string,
    reference: string,
    difficultyLevel: number | undefined,
    correctAnswers: CorrectAnswers[],  
    isActive: boolean,
    domainId: number,
    mainSubjectID: number | undefined    // added undefined
}