import { PrismaClient, UserRole, ProgrammingLanguage, Difficulty, TestSessionStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // Limpiar datos existentes (opcional, comenta si no quieres)
    // await prisma.answer.deleteMany();
    // await prisma.evaluation.deleteMany();
    // await prisma.testSession.deleteMany();
    // await prisma.testCase.deleteMany();
    // await prisma.question.deleteMany();
    // await prisma.test.deleteMany();
    // await prisma.user.deleteMany();

    // 1. Crear usuarios
    console.log('👤 Creating users...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const evaluator = await prisma.user.upsert({
        where: { email: 'evaluator@techbattle.com' },
        update: {},
        create: {
            email: 'evaluator@techbattle.com',
            password: hashedPassword,
            firstName: 'Maria',
            lastName: 'Evaluadora',
            role: UserRole.EVALUATOR,
        },
    });

    const candidate = await prisma.user.upsert({
        where: { email: 'candidate@techbattle.com' },
        update: {},
        create: {
            email: 'candidate@techbattle.com',
            password: hashedPassword,
            firstName: 'Juan',
            lastName: 'Candidato',
            role: UserRole.CANDIDATE,
        },
    });

    console.log('✅ Users created:', { evaluator: evaluator.email, candidate: candidate.email });

    // 2. Crear un test completo
    console.log('📝 Creating test...');

    const test = await prisma.test.upsert({
        where: { id: 'test-seed-javascript-fundamentals' },
        update: {},
        create: {
            id: 'test-seed-javascript-fundamentals',
            title: 'JavaScript Fundamentals - Array Methods',
            description: 'Evaluación de conocimientos básicos de JavaScript, enfocada en manipulación de arrays y funciones.',
            language: ProgrammingLanguage.JAVASCRIPT,
            framework: 'Vanilla JS',
            difficulty: Difficulty.MEDIUM,
            duration: 60, // 60 minutos
            isActive: true,
            createdById: evaluator.id,
            questions: {
                create: [
                    // Pregunta 1: Sum of Array
                    {
                        title: 'Suma de Elementos en un Array',
                        description: `
Escribe una función llamada \`sumArray\` que reciba un array de números y retorne la suma de todos sus elementos.

**Requisitos:**
- La función debe manejar arrays vacíos (retornar 0)
- Debe funcionar con números positivos y negativos
- No uses métodos como \`.reduce()\`, implementa tu propia lógica

**Ejemplo:**
\`\`\`javascript
sumArray([1, 2, 3, 4, 5]); // retorna 15
sumArray([-1, -2, -3]); // retorna -6
sumArray([]); // retorna 0
\`\`\`
            `,
                        starterCode: `function sumArray(numbers) {
  // Tu código aquí
  
}

// No modifiques esta línea
module.exports = sumArray;`,
                        points: 10,
                        order: 0,
                        testCases: {
                            create: [
                                {
                                    input: JSON.stringify({ numbers: [1, 2, 3, 4, 5] }),
                                    expectedOutput: '15',
                                    isHidden: false,
                                    order: 0,
                                },
                                {
                                    input: JSON.stringify({ numbers: [-1, -2, -3] }),
                                    expectedOutput: '-6',
                                    isHidden: false,
                                    order: 1,
                                },
                                {
                                    input: JSON.stringify({ numbers: [] }),
                                    expectedOutput: '0',
                                    isHidden: false,
                                    order: 2,
                                },
                                {
                                    input: JSON.stringify({ numbers: [100, -50, 25, -25] }),
                                    expectedOutput: '50',
                                    isHidden: true,
                                    order: 3,
                                },
                                {
                                    input: JSON.stringify({ numbers: [0, 0, 0] }),
                                    expectedOutput: '0',
                                    isHidden: true,
                                    order: 4,
                                },
                            ],
                        },
                    },
                    // Pregunta 2: Filter Even Numbers
                    {
                        title: 'Filtrar Números Pares',
                        description: `
Implementa una función llamada \`filterEvenNumbers\` que reciba un array de números y retorne un nuevo array con solo los números pares.

**Requisitos:**
- No modifiques el array original
- Retorna un array vacío si no hay números pares
- No uses el método \`.filter()\`, implementa tu propia lógica

**Ejemplo:**
\`\`\`javascript
filterEvenNumbers([1, 2, 3, 4, 5, 6]); // retorna [2, 4, 6]
filterEvenNumbers([1, 3, 5]); // retorna []
filterEvenNumbers([0, -2, 4]); // retorna [0, -2, 4]
\`\`\`
            `,
                        starterCode: `function filterEvenNumbers(numbers) {
  // Tu código aquí
  
}

// No modifiques esta línea
module.exports = filterEvenNumbers;`,
                        points: 15,
                        order: 1,
                        testCases: {
                            create: [
                                {
                                    input: JSON.stringify({ numbers: [1, 2, 3, 4, 5, 6] }),
                                    expectedOutput: JSON.stringify([2, 4, 6]),
                                    isHidden: false,
                                    order: 0,
                                },
                                {
                                    input: JSON.stringify({ numbers: [1, 3, 5] }),
                                    expectedOutput: JSON.stringify([]),
                                    isHidden: false,
                                    order: 1,
                                },
                                {
                                    input: JSON.stringify({ numbers: [0, -2, 4] }),
                                    expectedOutput: JSON.stringify([0, -2, 4]),
                                    isHidden: false,
                                    order: 2,
                                },
                                {
                                    input: JSON.stringify({ numbers: [10, 15, 20, 25, 30] }),
                                    expectedOutput: JSON.stringify([10, 20, 30]),
                                    isHidden: true,
                                    order: 3,
                                },
                                {
                                    input: JSON.stringify({ numbers: [] }),
                                    expectedOutput: JSON.stringify([]),
                                    isHidden: true,
                                    order: 4,
                                },
                            ],
                        },
                    },
                    // Pregunta 3: Find Max Value
                    {
                        title: 'Encontrar el Valor Máximo',
                        description: `
Crea una función llamada \`findMax\` que encuentre y retorne el número más grande en un array de números.

**Requisitos:**
- Si el array está vacío, retorna \`null\`
- Debe funcionar con números positivos y negativos
- No uses \`Math.max()\`, implementa tu propia lógica

**Ejemplo:**
\`\`\`javascript
findMax([1, 5, 3, 9, 2]); // retorna 9
findMax([-5, -1, -10]); // retorna -1
findMax([42]); // retorna 42
findMax([]); // retorna null
\`\`\`
            `,
                        starterCode: `function findMax(numbers) {
  // Tu código aquí
  
}

// No modifiques esta línea
module.exports = findMax;`,
                        points: 15,
                        order: 2,
                        testCases: {
                            create: [
                                {
                                    input: JSON.stringify({ numbers: [1, 5, 3, 9, 2] }),
                                    expectedOutput: '9',
                                    isHidden: false,
                                    order: 0,
                                },
                                {
                                    input: JSON.stringify({ numbers: [-5, -1, -10] }),
                                    expectedOutput: '-1',
                                    isHidden: false,
                                    order: 1,
                                },
                                {
                                    input: JSON.stringify({ numbers: [42] }),
                                    expectedOutput: '42',
                                    isHidden: false,
                                    order: 2,
                                },
                                {
                                    input: JSON.stringify({ numbers: [] }),
                                    expectedOutput: 'null',
                                    isHidden: false,
                                    order: 3,
                                },
                                {
                                    input: JSON.stringify({ numbers: [0, 0, 0, 1] }),
                                    expectedOutput: '1',
                                    isHidden: true,
                                    order: 4,
                                },
                                {
                                    input: JSON.stringify({ numbers: [-100, -200, -50, -150] }),
                                    expectedOutput: '-50',
                                    isHidden: true,
                                    order: 5,
                                },
                            ],
                        },
                    },
                ],
            },
        },
    });

    console.log('✅ Test created:', test.title);

    console.log('\n🎉 Seed completed successfully!\n');
    console.log('📋 Login credentials:');
    console.log('┌─────────────────────────────────────────┐');
    console.log('│ Evaluator:                              │');
    console.log('│   Email: evaluator@techbattle.com       │');
    console.log('│   Password: password123                 │');
    console.log('├─────────────────────────────────────────┤');
    console.log('│ Candidate:                              │');
    console.log('│   Email: candidate@techbattle.com       │');
    console.log('│   Password: password123                 │');
    console.log('└─────────────────────────────────────────┘');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });