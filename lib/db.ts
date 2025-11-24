import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data.json');

export type Role = 'SDR' | 'CLOSER' | 'LEADER' | 'CEO';

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: Role;
    avatarUrl?: string;
}

export interface LeadEntry {
    id: string;
    userId: string;
    week: string;
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

export interface MetricEntry {
    id: string;
    userId: string;
    role: Role;
    week: string;
    leadsExecuted: number;
    leadsQualified: number;
    meetings: number;
    proposals: number;
    closings: number;
    status: 'pending' | 'validated' | 'rejected';
    createdAt: string;
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
    metricEntries: MetricEntry[];
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
    metricEntries: [],
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

// In-memory fallback for Vercel (since it's read-only filesystem)
let memoryDB: DatabaseSchema | null = null;

export function getDB(): DatabaseSchema {
    if (memoryDB) return memoryDB;

    try {
        if (!fs.existsSync(DB_PATH)) {
            // If we can't write, we just return initial data
            try {
                fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
            } catch (e) {
                console.warn('Could not write to file system, using in-memory DB');
                memoryDB = JSON.parse(JSON.stringify(initialData));
                return memoryDB!;
            }
        }
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        memoryDB = JSON.parse(data);
        return memoryDB!;
    } catch (error) {
        // Fallback if file read fails
        memoryDB = JSON.parse(JSON.stringify(initialData));
        return memoryDB!;
    }
}

export function saveDB(data: DatabaseSchema) {
    memoryDB = data;
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
        console.warn('Could not write to file system (expected on Vercel), data saved to memory only.');
    }
}

export async function getUser(email: string) {
    const db = getDB();
    return db.users.find(u => u.email === email);
}

export async function getUserById(id: string) {
    const db = getDB();
    return db.users.find(u => u.id === id);
}
