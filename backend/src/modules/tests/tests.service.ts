import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestDto } from './dto/create-test.dto';

@Injectable()
export class TestsService {
    constructor(private prisma: PrismaService) {}

    async create(createTestDto: CreateTestDto, userId: string) {
        return this.prisma.test.create({
            data: {
                ...createTestDto,
                createdById: userId,
                questions: {
                    create: createTestDto.questions.map((q, index) => ({
                        title: q.title,
                        description: q.description,
                        starterCode: q.starterCode,
                        points: q.points,
                        order: index,
                        testCases: {
                            create: q.testCases.map((tc, idx) => ({
                                input: tc.input,
                                expectedOutput: tc.expectedOutput,
                                isHidden: !!tc.isHidden,
                                order: idx,
                            })),
                        },
                    })),
                },
            },
            include: {
                questions: {
                    include: {
                        testCases: true,
                    },
                },
            },
        });
    }

    async findAll(filters?: any) {
        return this.prisma.test.findMany({
            where: {
                isActive: true,
                ...filters,
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                _count: {
                    select: {
                        questions: true,
                        sessions: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findOne(id: string) {
        const test = await this.prisma.test.findUnique({
            where: { id },
            include: {
                questions: {
                    include: {
                        testCases: true,
                    },
                    orderBy: {
                        order: 'asc',
                    },
                },
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        if (!test) {
            throw new NotFoundException(`Test with ID ${id} not found`);
        }

        return test;
    }
}
