import prisma from './lib/prisma.js';

async function checkUsers() {
    const users = await prisma.user.findMany({
        select: {
            email: true,
            password: true,
            role: true,
            name: true
        }
    });

    console.log('\n📋 USUÁRIOS NO BANCO:\n');
    users.forEach(u => {
        console.log(`${u.role}: ${u.email} / ${u.password}`);
    });
    console.log('\n');

    await prisma.$disconnect();
}

checkUsers();
