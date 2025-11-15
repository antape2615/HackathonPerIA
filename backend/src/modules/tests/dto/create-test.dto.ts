import { IsString, IsEnum, IsInt, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ProgrammingLanguage, Difficulty } from '@prisma/client';

class CreateTestCaseDto {
    @IsString()
    input: string;

    @IsString()
    expectedOutput: string;

    isHidden?: boolean;
}

class CreateQuestionDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    starterCode: string;

    @IsInt()
    @Min(1)
    points: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateTestCaseDto)
    testCases: CreateTestCaseDto[];
}

export class CreateTestDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsEnum(ProgrammingLanguage)
    language: ProgrammingLanguage;

    @IsString()
    framework: string;

    @IsEnum(Difficulty)
    difficulty: Difficulty;

    @IsInt()
    @Min(5)
    duration: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateQuestionDto)
    questions: CreateQuestionDto[];
}
