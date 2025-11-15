import { IsString, IsNotEmpty } from 'class-validator';

export class SubmitAnswerDto {
    @IsString()
    @IsNotEmpty()
    sessionId: string;

    @IsString()
    @IsNotEmpty()
    questionId: string;

    @IsString()
    @IsNotEmpty()
    code: string;
}
