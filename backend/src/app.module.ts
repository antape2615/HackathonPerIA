import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { TestsModule } from './modules/tests/tests.module';
import { EvaluationsModule } from './modules/evaluations/evaluations.module';
import { AiModule } from './modules/ai/ai.module';
import { CodeExecutionModule } from './modules/code-execution/code-execution.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    TestsModule,
    EvaluationsModule,
    AiModule,
    CodeExecutionModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
