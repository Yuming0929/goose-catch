import * as THREE from 'three';
const tileWidth = 4;
const tileDepth = 10;
const tileHeight = 0.2;

const transparentMaterial = new THREE.MeshStandardMaterial({ transparent: true, opacity: 0.0 });
const Container = () => {

    return <>

        <group>

            <mesh material={transparentMaterial} position={[0, 0, 0]}>
                <boxGeometry args={[tileWidth * 4, tileHeight , tileWidth * 4]} />
                
            </mesh>



            <mesh position={[0, 4, -2.1]} material={transparentMaterial}>
                <boxGeometry args={[tileWidth, tileDepth, tileHeight]} />

            </mesh>
            <mesh position={[0, 4, 2.1]} material={transparentMaterial}>
                <boxGeometry args={[tileWidth, tileDepth, tileHeight]} />
            </mesh>

            <mesh position={[2.1, 4, 0]} material={transparentMaterial}>
                <boxGeometry args={[tileHeight, tileDepth, tileWidth]} />

            </mesh>

            <mesh position={[-2.1, 4, 0]} material={transparentMaterial}>
                <boxGeometry args={[tileHeight, tileDepth, tileWidth]} />

            </mesh>

        </group>

    </>
}

export default Container;