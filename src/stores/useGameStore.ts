import { create } from 'zustand';
import * as THREE from 'three';

interface BagItem {
    id: number;
    type: number;
    meshRef: React.RefObject<THREE.Object3D | null>;

}

interface GameState {
    gamePhase: 'ready' | 'playing' | 'paused' | 'gameover' | 'win';
    time: number;
    totalItems: number;
    itemsLeft: number;
    bagCapacity: number;
    bagItemsCount: number;
    bagItems: BagItem[];
    slotPositions: THREE.Vector3[];
    start: () => void;
    end: () => void;
    win: () => void;
    lose: () => void;
    paused: () => void;
    resume: () => void;
    // getNextPosition: () => THREE.Vector3 | null;
    addItemAndGetPosition: (item: BagItem) => THREE.Vector3 | null;
    checkAndRemoveItems: () => boolean;
}

export const useGameStore = create<GameState>((set, get) => ({
    gamePhase: 'ready',
    time: 120,
    totalItems: 3 * 7 *5,
    itemsLeft: 3 * 7 * 5,
    bagCapacity: 6,
    bagItemsCount: 0,
    bagItems: [],
    slotPositions: [
        new THREE.Vector3(-2.25, 0.2, 3),
        new THREE.Vector3(-1.35, 0.2, 3),
        new THREE.Vector3(-0.45, 0.2, 3),
        new THREE.Vector3(0.45, 0.2, 3),
        new THREE.Vector3(1.35, 0.2, 3),
        new THREE.Vector3(2.25, 0.2, 3),
    ],

    start: () => set({
        gamePhase: 'playing',
        bagItemsCount: 0,
        bagItems: [],
        itemsLeft: get().totalItems

    }),
    paused: () => set({ gamePhase: 'paused' }),
    resume: () => set({ gamePhase: 'playing' }),
    end: () => set({ gamePhase: 'ready' }),
    win: () => set({ gamePhase: 'win' }),
    lose: () => set({ gamePhase: 'gameover' }),
    //向 bag 中添加 item 优先插入到已有type的后面
    // 
    //检查是否有三个同样type的item，如果有则移除它们并更新 bagItemsCount
    // 如果没有移除且容量已满则返回false，否则返回true
    checkAndRemoveItems: () => {
        const { bagItems } = get();
        const typeCount: { [key: number]: number[] } = {};
        bagItems.forEach((item, index) => {
            if (!typeCount[item.type]) {
                typeCount[item.type] = [];
            }
            typeCount[item.type].push(index);
        });

        let indicesToRemove: number[] = [];
        Object.values(typeCount).forEach((indices) => {
            if (indices.length >= 3) {
                indicesToRemove = indicesToRemove.concat(indices.slice(0, 3));
            }
        });

        let full = false;

        if (indicesToRemove.length > 0) {
            // 有需要移除的item，更新状态
            indicesToRemove.forEach(i => bagItems[i].meshRef.current && (bagItems[i].meshRef.current!.visible = false));

            set((state) => {
                const newBagItems = state.bagItems.filter((_, index) => !indicesToRemove.includes(index));
                return {
                    bagItems: newBagItems,
                    bagItemsCount: newBagItems.length,

                };
            });
        } else if (bagItems.length >= get().bagCapacity) {
            full = true;
        }

        return !full;
    },

    //添加item并获取其位置
    addItemAndGetPosition: (item: BagItem) => {
        const { slotPositions, bagCapacity } = get();
        const { bagItems } = get();

        if (bagItems.length >= bagCapacity) return null;

        const existingTypeIndex = bagItems.findIndex(i => i.type === item.type);
        let newIndex = existingTypeIndex !== -1 ? existingTypeIndex + 1 : bagItems.length;
        const newPosition = slotPositions[newIndex] ?? slotPositions[slotPositions.length - 1];

        const newBagItems = [
            ...bagItems.slice(0, newIndex),
            item,
            ...bagItems.slice(newIndex),
        ];

        set({
            bagItems: newBagItems,
            bagItemsCount: newBagItems.length,
            itemsLeft: get().itemsLeft - 1,
        });

        return newPosition;

    }
})
);