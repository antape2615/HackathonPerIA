import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import { AnalyzeService } from './analyze.service';
import { AnalyzeDto } from './dto/analyze.dto';
import { AnalyzeFlowDto } from './dto/analyze-flow.dto';

@Controller('analyze')
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}

  @Get()
  getStatus() {
    return '🚀 Backend activo con IA de Groq (LLaMA 3)';
  }

  @Post()
  async analyze(@Body() analyzeDto: AnalyzeDto) {
    const { problem, source } = analyzeDto;

    return await this.analyzeService.processProblem(problem, source);
  }

  @Post('flow')
  async guidedFlow(@Body() dto: AnalyzeFlowDto) {
    return this.analyzeService.guidedConversation(dto);
  }

  @Post('pdf')
  async generatePDF(@Body() body: any, @Res() res: any) {
    return this.analyzeService.generatePDF(body, res);
  }
}
