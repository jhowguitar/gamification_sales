import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data.json');

export type Role = 'SDR' | 'CLOSER' | 'LEADER' | 'CEO';

export interface User {
    id: string;
    name: string;
    email: string;
    password: string; // In a real app, this would be hashed
    role: Role;
    avatarUrl?: string;
}

export interface LeadEntry {
    id: string;
    userId: string;
    week: string; // Format: "YYYY-Www"
    leadsExecuted: number;
    leadsQualified: number;
    createdAt: string;
}

export interface SaleEntry {
    id: string;
    userId: string;
    week: string;
    clientName: string;
    setupValue: number;
    paymentMethod: 'PIX' | 'CREDIT_CARD';
    installments?: number;
    createdAt: string;
}

export interface GoalConfig {
    weeklyGoal: number;
    monthlyGoal: number;
    leadExecutedValue: number;
    leadQualifiedValue: number;
    closerBonusValue: number;
    closerBonusThreshold: number;
}

export interface Message {
    id: string;
    fromUserId: string;
    toUserId: string;
    title: string;
    content: string;
    read: boolean;
    createdAt: string;
}

export interface DatabaseSchema {
    users: User[];
    leadEntries: LeadEntry[];
    saleEntries: SaleEntry[];
    messages: Message[];
    config: GoalConfig;
    ceoMessage: string;
    awardsBanner: {
        imageUrl: string;
        title: string;
        description: string;
    };
}

const initialData: DatabaseSchema = {
    users: [
        {
            id: '1',
            name: 'Admin CEO',
            email: 'ceo@gamification.com',
            password: 'admin',
            role: 'CEO',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CEO'
        },
        {
            id: '2',
            name: 'SDR Star',
            email: 'sdr@gamification.com',
            password: '123',
            role: 'SDR',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SDR'
        },
        {
            id: '3',
            name: 'Closer Pro',
            email: 'closer@gamification.com',
            password: '123',
            role: 'CLOSER',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Closer'
        }
    ],
    leadEntries: [],
    saleEntries: [],
    messages: [],
    config: {
        weeklyGoal: 50000,
        monthlyGoal: 200000,
        leadExecutedValue: 10,
        leadQualifiedValue: 20,
        closerBonusValue: 500,
        closerBonusThreshold: 17000
    },
    ceoMessage: '<h1>Vamos bater a meta!</h1><p>Conto com todos vocês para alcançarmos nossos objetivos este mês.</p>',
    awardsBanner: {
        imageUrl: 'https://images.unsplash.com/photo-1533227297464-c751417b02b8?auto=format&fit=crop&q=80&w=1000',
        title: 'Prêmio do Mês',
        description: 'Um jantar no melhor restaurante da cidade!'
    }
};

export function getDB(): DatabaseSchema {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
}

export function saveDB(data: DatabaseSchema) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Helper functions
export async function getUser(email: string) {
    const db = getDB();
    return db.users.find(u => u.email === email);
}

export async function getUserById(id: string) {
    const db = getDB();
    return db.users.find(u => u.id === id);
}
