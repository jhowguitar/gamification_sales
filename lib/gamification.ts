import { UserLevel } from '@prisma/client';

// SDR Level Thresholds
const SDR_STAR_MAX = 2500;
const SDR_PRO_MAX = 5000;
const SDR_ELITE_MAX = 10000;

// Closer Level Thresholds (based on total sales)
const CLOSER_STAR_MAX = 30000;
const CLOSER_PRO_MAX = 50000;

// Closer Bonus Thresholds
const CLOSER_BONUS_30K = 30000;
const CLOSER_BONUS_45K = 45000;
const CLOSER_BONUS_50K = 50000;
const CLOSER_BONUS_65K = 65000;

/**
 * Calcula o nível do SDR baseado na comissão total do mês
 */
export function calculateSDRLevel(totalCommission: number): UserLevel {
    if (totalCommission >= SDR_ELITE_MAX) return 'ELITE';
    if (totalCommission >= SDR_PRO_MAX) return 'PRO';
    return 'STAR';
}

/**
 * Calcula o nível do Closer baseado no total de vendas do mês
 */
export function calculateCloserLevel(totalSales: number): UserLevel {
    if (totalSales > CLOSER_PRO_MAX) return 'ELITE';
    if (totalSales > CLOSER_STAR_MAX) return 'PRO';
    return 'STAR';
}

/**
 * Calcula a comissão do SDR baseado no nível atual
 */
export function calculateSDRCommission(
    leadsExecuted: number,
    leadsQualified: number,
    currentLevel: UserLevel,
    config: any
): number {
    let showValue = 0;
    let qualifiedValue = 0;

    switch (currentLevel) {
        case 'STAR':
            showValue = config.sdrStarShow || 5;
            qualifiedValue = config.sdrStarQualified || 15;
            break;
        case 'PRO':
            showValue = config.sdrProShow || 10;
            qualifiedValue = config.sdrProQualified || 20;
            break;
        case 'ELITE':
            showValue = config.sdrEliteShow || 15;
            qualifiedValue = config.sdrEliteQualified || 25;
            break;
    }

    return (leadsExecuted * showValue) + (leadsQualified * qualifiedValue);
}

/**
 * Calcula o bônus percentual do Closer baseado no total de vendas
 */
export function calculateCloserBonus(totalSales: number, config: any): number {
    if (totalSales >= CLOSER_BONUS_65K) return config.closerBonus65k || 35;
    if (totalSales >= CLOSER_BONUS_50K) return config.closerBonus50k || 25;
    if (totalSales >= CLOSER_BONUS_45K) return config.closerBonus45k || 20;
    if (totalSales >= CLOSER_BONUS_30K) return config.closerBonus30k || 10;
    return 0;
}

/**
 * Calcula a comissão total do Closer com bônus aplicado
 */
export function calculateCloserCommissionWithBonus(
    baseCommission: number,
    totalSales: number,
    config: any
): number {
    const bonusPercentage = calculateCloserBonus(totalSales, config);
    const bonus = (baseCommission * bonusPercentage) / 100;
    return baseCommission + bonus;
}

/**
 * Retorna o nome do nível em português
 */
export function getLevelName(level: UserLevel): string {
    const names = {
        STAR: 'Star',
        PRO: 'Pro',
        ELITE: 'Elite'
    };
    return names[level] || 'Star';
}

/**
 * Retorna a cor do nível para UI
 */
export function getLevelColor(level: UserLevel): string {
    const colors = {
        STAR: 'from-blue-500 to-cyan-500',
        PRO: 'from-purple-500 to-pink-500',
        ELITE: 'from-yellow-500 to-orange-500'
    };
    return colors[level] || colors.STAR;
}

/**
 * Retorna o ícone/emoji do nível
 */
export function getLevelIcon(level: UserLevel): string {
    const icons = {
        STAR: '⭐',
        PRO: '🔥',
        ELITE: '👑'
    };
    return icons[level] || icons.STAR;
}
