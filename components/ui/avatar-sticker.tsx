export const AVATAR_STICKERS = [
    { id: 1, emoji: '😎', name: 'Óculos Escuros', bg: 'from-gray-700 to-gray-900' },
    { id: 2, emoji: '🤑', name: 'Cifrões nos Olhos', bg: 'from-green-500 to-emerald-600' },
    { id: 3, emoji: '😁', name: 'Sorriso Grande', bg: 'from-yellow-400 to-orange-500' },
    { id: 4, emoji: '💰', name: 'Segurando Dinheiro', bg: 'from-green-600 to-teal-600' },
    { id: 5, emoji: '🎉', name: 'Comemorando', bg: 'from-pink-500 to-rose-600' },
    { id: 6, emoji: '⚡', name: 'Raio', bg: 'from-yellow-500 to-amber-600' },
    { id: 7, emoji: '🏆', name: 'Troféu', bg: 'from-yellow-600 to-yellow-700' },
    { id: 8, emoji: '🚀', name: 'Foguete', bg: 'from-blue-500 to-indigo-600' },
];

interface AvatarStickerProps {
    stickerId: number;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showBg?: boolean;
}

export function AvatarSticker({ stickerId, size = 'md', showBg = true }: AvatarStickerProps) {
    const sticker = AVATAR_STICKERS.find(s => s.id === stickerId) || AVATAR_STICKERS[0];

    const sizes = {
        sm: 'w-8 h-8 text-xl',
        md: 'w-12 h-12 text-3xl',
        lg: 'w-16 h-16 text-4xl',
        xl: 'w-24 h-24 text-6xl'
    };

    return (
        <div
            className={`
        ${sizes[size]} 
        rounded-full 
        flex items-center justify-center
        ${showBg ? `bg-gradient-to-br ${sticker.bg}` : ''}
        shadow-lg
      `}
        >
            <span className="select-none">{sticker.emoji}</span>
        </div>
    );
}

interface AvatarSelectorProps {
    selectedId: number;
    onSelect: (id: number) => void;
}

export function AvatarSelector({ selectedId, onSelect }: AvatarSelectorProps) {
    return (
        <div className="grid grid-cols-4 gap-4">
            {AVATAR_STICKERS.map((sticker) => (
                <button
                    key={sticker.id}
                    onClick={() => onSelect(sticker.id)}
                    className={`
            relative
            w-16 h-16
            rounded-full
            bg-gradient-to-br ${sticker.bg}
            flex items-center justify-center
            text-3xl
            transition-all duration-200
            hover:scale-110
            ${selectedId === sticker.id ? 'ring-4 ring-primary scale-110' : 'opacity-70 hover:opacity-100'}
          `}
                    title={sticker.name}
                >
                    <span className="select-none">{sticker.emoji}</span>
                    {selectedId === sticker.id && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-xs text-white">✓</span>
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
}
