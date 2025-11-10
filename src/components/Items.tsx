import { useGameStore } from '../stores/useGameStore';
import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

import iceCreameUrl from '../assets/ice-cream.glb?url';
import cheesseUrl from '../assets/cheese.glb?url';
import coockieManUrl from '../assets/coockie-man.glb?url';
import hotdogUrl from '../assets/hotdog.glb?url';
import sandwichUrl from '../assets/sandwich.glb?url';
import sandwichToastUrl from '../assets/sandwich-toast.glb?url';
import pancakeBigUrl from '../assets/pancake-big.glb?url';
import Item from './Item';


// 预加载所有模型
useGLTF.preload(iceCreameUrl);
useGLTF.preload(coockieManUrl);
useGLTF.preload(cheesseUrl);
useGLTF.preload(hotdogUrl);
useGLTF.preload(sandwichUrl);
useGLTF.preload(sandwichToastUrl);
useGLTF.preload(pancakeBigUrl);

const Items = () => {
    const phase = useGameStore((state: { gamePhase: string }) => state.gamePhase);
    const totalItems = useGameStore((state) => state.totalItems);
    const models = useMemo(() => ({

        iceCreame: useGLTF(iceCreameUrl),
        cookieMan: useGLTF(coockieManUrl),
        cheese: useGLTF(cheesseUrl),
        hotdog: useGLTF(hotdogUrl),
        sandwich: useGLTF(sandwichUrl),
        sandwichToast: useGLTF(sandwichToastUrl),
        pancake: useGLTF(pancakeBigUrl),
    }), []);

    const items = useMemo(() => Array.from({ length: totalItems }, (_, i) => ({
        id: i,
        pos: [((i % 10) - 5) * 0.3, 
        Math.floor(i / 10) * 0.6 + 1,
        (Math.floor(i / 50) - 0.5) * 0.3
        ],
        delay: (i / 90) * 1000,
        type: i % 7,
    })), []);
    return (
        <>
            {   
            
                phase === 'playing' || phase === 'paused' ? 
                (
                    <group >
                        {items.map(({ id, pos, delay, type }, i) => (
                            <Item
                                id={id}
                                key={i}
                                type={type}
                                position={pos as [number, number, number]}
                                delay={delay}
                                object={Object.values(models)[type]}
                            />
                        ))}
                    </group>
            ) : null
            }
        </>
    );
}
export default Items;