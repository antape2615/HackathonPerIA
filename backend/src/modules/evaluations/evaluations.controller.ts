import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('evaluations')
@UseGuards(JwtAuthGuard)
export class EvaluationsController {
    constructor(private readonly evaluationsService: EvaluationsService) {}

    @Post('start/:testId')
    async startTest(@Param('testId') testId: string, @Request() req) {
        return this.evaluationsService.startTest(testId, req.user.id);
    }

    @Get('session/:sessionId')
    async getSession(@Param('sessionId') sessionId: string, @Request() req) {
        return this.evaluationsService.getSession(sessionId, req.user.id);
    }

    @Post('submit-answer')
    async submitAnswer(
        @Body() body: { sessionId: string; questionId: string; code: string },
    ) {
        return this.evaluationsService.submitAnswer(
            body.sessionId,
            body.questionId,
            body.code,
        );
    }

    @Post('finish/:sessionId')
    async finishTest(@Param('sessionId') sessionId: string, @Request() req) {
        return this.evaluationsService.finishTest(sessionId, req.user.id);
    }

    @Get('results/:sessionId')
    async getSessionResults(@Param('sessionId') sessionId: string) {
        return this.evaluationsService.getSessionResults(sessionId);
    }

    @Get('my-sessions')
    async getMySessions(@Request() req) {
        return this.evaluationsService.getMySessions(req.user.id);
    }
}