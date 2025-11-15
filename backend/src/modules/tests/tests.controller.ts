import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TestsService } from './tests.service';
import { CreateTestDto } from './dto/create-test.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { RolesGuard } from '@/common/guards/roles.guard';

@Controller('tests')
@UseGuards(JwtAuthGuard)
export class TestsController {
    constructor(private testsService: TestsService) {}

    @Post()
    @UseGuards(RolesGuard)
    @Roles('EVALUATOR', 'ADMIN')
    async create(@Body() createTestDto: CreateTestDto, @Request() req) {
        return this.testsService.create(createTestDto, req.user.id);
    }

    @Get()
    async findAll() {
        return this.testsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.testsService.findOne(id);
    }
}
