import prisma from './lib/prisma';

async function testConnection() {
    try {
        console.log('🔍 Testando conexão com o banco de dados...');

        // Tentar conectar
        await prisma.$connect();
        console.log('✅ Conectado ao banco de dados!');

        // Tentar buscar usuários
        const users = await prisma.user.findMany();
        console.log(`✅ Encontrados ${users.length} usuários:`, users.map(u => u.email));

        // Tentar buscar métricas
        const metrics = await prisma.metricEntry.findMany();
        console.log(`✅ Encontradas ${metrics.length} métricas`);

        await prisma.$disconnect();
        console.log('✅ Teste concluído com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao conectar:', error);
        process.exit(1);
    }
}

testConnection();
