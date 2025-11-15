import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AIService } from './ai.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AIController {
    constructor(private aiService: AIService) {}

    @Post('evaluate')
    async evaluateCode(
        @Body() body: {
            code: string;
            language: string;
            question: string;
            testCasesPassed: number;
            totalTestCases: number;
        },
    ) {
        return this.aiService.evaluateCode(
            body.code,
            body.language,
            body.question,
            body.testCasesPassed,
            body.totalTestCases,
        );
    }
}
