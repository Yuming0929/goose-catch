import * as THREE from 'three';
const boxGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.8);
const boxMaterial = new THREE.MeshStandardMaterial({ color: 'orange', transparent: true, opacity: 0.5 });

//卡槽位置array
//相隔0.9单位 共6个
const slotPositions = [
    new THREE.Vector3(-2.25, 0.2, 3),
    new THREE.Vector3(-1.35, 0.2, 3),
    new THREE.Vector3(-0.45, 0.2, 3),
    new THREE.Vector3(0.45, 0.2, 3),
    new THREE.Vector3(1.35, 0.2, 3),
    new THREE.Vector3(2.25, 0.2, 3),
];

const Bag = () => {

    return <>

    <group receiveShadow>
        {/* bag item */}
        <mesh position={[0, 0, 3]}>
            <boxGeometry args={[6, 0.1, 1]} />
            <meshStandardMaterial color="lightblue" />
        </mesh>

        {/* 卡槽位置 */}
        {slotPositions.map((pos, index) => (
            <mesh key={index} geometry={boxGeometry} material={boxMaterial} position={
                pos
            }  />
        ))}
    </group>
    </>
}

export default Bag;