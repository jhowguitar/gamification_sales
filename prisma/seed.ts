import prisma from '../lib/prisma.js';

async function main() {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Criar configuração padrão
    const config = await prisma.config.upsert({
        where: { id: 'default' },
        update: {},
        create: {
            id: 'default',
            weeklyGoal: 50000,
            monthlyGoal: 200000,
            leadExecutedValue: 10,
            leadQualifiedValue: 20,
            closerBonusValue: 500,
            closerBonusThreshold: 17000,
            ceoMessage: '<h1>Vamos bater a meta!</h1><p>Conto com todos vocês para alcançarmos nossos objetivos este mês.</p>',
            awardsBannerImageUrl: 'https://images.unsplash.com/photo-1533227297464-c751417b02b8?auto=format&fit=crop&q=80&w=1000',
            awardsBannerTitle: 'Prêmio do Mês',
            awardsBannerDescription: 'Um jantar no melhor restaurante da cidade!'
        },
    });

    console.log('✅ Configuração criada:', config);

    // Criar usuários padrão
    const ceo = await prisma.user.upsert({
        where: { email: 'ceo@gamification.com' },
        update: {},
        create: {
            name: 'Admin CEO',
            email: 'ceo@gamification.com',
            password: 'admin', // Em produção, use hash!
            role: 'CEO',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CEO'
        },
    });

    const sdr = await prisma.user.upsert({
        where: { email: 'sdr@gamification.com' },
        update: {},
        create: {
            name: 'SDR Star',
            email: 'sdr@gamification.com',
            password: '123', // Em produção, use hash!
            role: 'SDR',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SDR'
        },
    });

    const closer = await prisma.user.upsert({
        where: { email: 'closer@gamification.com' },
        update: {},
        create: {
            name: 'Closer Pro',
            email: 'closer@gamification.com',
            password: '123', // Em produção, use hash!
            role: 'CLOSER',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Closer'
        },
    });

    console.log('✅ Usuários criados:', { ceo, sdr, closer });
    console.log('🎉 Seed concluído com sucesso!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
