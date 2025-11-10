import * as THREE from 'three';
import { useState, useEffect, useMemo, useRef } from "react";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { gsap } from 'gsap';
import { useGLTF } from '@react-three/drei';

import { useGameStore } from '../stores/useGameStore';


const selectedMaterial = new THREE.MeshStandardMaterial({
    color: 'gold',
    side: THREE.BackSide,
    depthTest: false,
    transparent: true,
});

interface ItemComponentProps {
    id: number;
    position: [number, number, number];
    object: ReturnType<typeof useGLTF> | undefined;
    delay: number;
    type: number;
}

const isMesh = (obj: any): obj is THREE.Mesh => {
    return obj?.isMesh === true;
};

const Item = ({ id, position, object, delay, type }: ItemComponentProps) => {
    const [hovered, setHover] = useState(false);
    const [visible, setVisible] = useState(false);
    const [picked, setPicked] = useState(false);
    const selectedMesh = useRef<THREE.Object3D | null>(null);
    const bodyRef = useRef<RapierRigidBody>(null);
    
    const { bagItems,itemsLeft, checkAndRemoveItems,win, lose, addItemAndGetPosition, slotPositions } = useGameStore();


    const targetRef = useRef(new THREE.Vector3(0, -10, 0));

   

    // 选取动画相关引用
    const animRef = useRef<THREE.Group>(null);
    const startPosRef = useRef(new THREE.Vector3());
    const tweenRef = useRef<gsap.core.Tween | null>(null);

    // 克隆模型以避免引用同一个实例
    const model = useMemo(() => {
        if (!object) return undefined;
        const gltf = Array.isArray(object) ? object[0] : object;
        return gltf?.scene?.clone(true);
    }, [object]);
    const originalMaterial = useRef<THREE.Material | null>(null);

    //实现逐渐生成
    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(true);
        }, delay);
        return () => clearTimeout(timer);
    }, [delay]);

    // hover 变色
    useEffect(() => {

        // console.log('selectedMesh', selectedMesh.current);
        // console.log('originalMaterial', originalMaterial.current);
        if (!selectedMesh.current) return;

        selectedMesh.current.traverse((child: any) => {
            if (child.isMesh && child.material) {
                if (hovered) {

                    if (!originalMaterial.current) {
                        originalMaterial.current = child.material;
                    }
                    child.material = selectedMaterial;
                } else {
                    if (originalMaterial.current) {
                        child.material = originalMaterial.current;
                    }
                }
            }
        });
    }, [hovered]);

    const moveToTarget = (
        tweenRef: React.MutableRefObject<gsap.core.Tween | null>,
        animRef: React.RefObject<THREE.Group | null>,
        target: THREE.Vector3 = targetRef.current
    ) => {
        if (!animRef.current) return;
        tweenRef.current?.kill();
        tweenRef.current = gsap.to(animRef.current.position, {
            x: target.x,
            y: target.y,
            z: target.z,
            duration: 0.2,
            ease: 'power3.inOut',
        });


    }

    // 拾取动画
    useEffect(() => {
        if (!picked || !animRef.current) return;
        moveToTarget(tweenRef, animRef, targetRef.current);
        // 还原材质
        if (model) {
            model.traverse((child: any) => {
                if (isMesh(child) && child.material) {
                    if (originalMaterial.current) {
                        child.material = originalMaterial.current;
                    }
                }
            });
        }
        // 拾取后更新背包状态
        const bagAvailable = checkAndRemoveItems();
        if (!bagAvailable) {
            lose();
        }
        if(itemsLeft == 0){
            //没有剩余物品，游戏胜利
            win();
        }

        return () => {
            tweenRef.current?.kill();
        };
    }, [picked]);


    useEffect(() => {
        // 当 bagItems 变化时，更新场景中物体位置
        if (!picked) return;
        bagItems.forEach((item, index) => {
            if (item.meshRef && item.meshRef.current) {
                const targetPos = slotPositions[index];

                gsap.to(item.meshRef.current.position, {
                    x: targetPos.x,
                    y: targetPos.y,
                    z: targetPos.z,
                    duration: 0.2,
                    ease: 'power3.inOut',
                });

            }
        });
    }, [bagItems]);


    // 组件卸载时清理
    useEffect(() => {
        return () => {
            tweenRef.current?.kill();
            originalMaterial.current = null;
            if (model) {
                model.traverse((child: any) => {
                    if (child.isMesh) {
                        child.geometry?.dispose();
                        if (Array.isArray(child.material)) {
                            child.material.forEach((m: THREE.Material) => m.dispose());
                        } else {
                            child.material?.dispose();
                        }
                    }
                });
            }
        };
    }, [model]);

    if (!visible) {
        return null;
    }
    if (picked) {
        return (
            <group
                ref={animRef}

                scale={0.6}
                position={[startPosRef.current.x, startPosRef.current.y, startPosRef.current.z]}
            >
                {model ? <primitive object={model} material={originalMaterial.current} /> : null}
            </group>
        );
    }
    return (


        <RigidBody position={position} colliders='hull' ref={bodyRef}>

            {object &&
                <group
                    ref={selectedMesh as any}
                    onPointerEnter={(e) => {
                        e.stopPropagation();
                        selectedMesh.current = e.object;
                        setHover(true);

                    }}
                    onPointerOut={() => { setHover(false) }}
                    // onPointerDown={(e) => { e.stopPropagation(); }}
                    onPointerUp={(e) => {

                        e.stopPropagation();

                        const api = bodyRef.current;
                        if (api) {
                            const t = api.translation();
                            startPosRef.current.set(t.x, t.y, t.z);
                        } else if (selectedMesh.current) {
                            selectedMesh.current.getWorldPosition(startPosRef.current);
                        }
                        selectedMesh.current = e.object;
                        // gameStore.addItem({ id, type, meshRef: selectedMesh.current });
                        const nextPosition = addItemAndGetPosition({ id, type, meshRef: animRef })
                        if (nextPosition) {
                            targetRef.current.set(nextPosition.x, nextPosition.y, nextPosition.z);
                        } else {
                            lose();
                        }
                        setPicked(true);
                    }}
                >
                    {model ? <primitive object={model} scale={0.6}  >

                    </primitive> : null}
                </group>
            }

        </RigidBody>
    );
}

export default Item;