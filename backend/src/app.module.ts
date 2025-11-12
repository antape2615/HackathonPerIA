import { Module } from '@nestjs/common';
import { AnalyzeModule } from './analyze/analyze.module';

@Module({
  imports: [AnalyzeModule],
})
export class AppModule {}
