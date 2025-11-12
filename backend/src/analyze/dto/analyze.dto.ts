import { IsString, IsOptional } from 'class-validator';

export class AnalyzeDto {
  @IsString({ message: 'El campo "problem" debe ser un texto válido.' })
  problem: string;

  @IsOptional()
  @IsString()
  source?: string;
}
