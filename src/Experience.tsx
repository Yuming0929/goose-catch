import { Physics, RigidBody } from "@react-three/rapier"
import Container from "./components/Container"
import Items from "./components/Items"
import { useGameStore } from "./stores/useGameStore";
import { Attractor } from "@react-three/rapier-addons";
import Bag from "./components/Bag";
const Experience = () => {

    const gamePhase = useGameStore((state) => state.gamePhase);
    const attractorStrength = 0.1


    return <>


        <Physics debug={false} gravity={[0, 0, 0]} timeStep="vary" paused={gamePhase !== 'playing'} >
            <RigidBody type="fixed" colliders="cuboid">
                <Container />
                <Attractor position={[0, 0, 0]} strength={attractorStrength} range={20}
                />
            </RigidBody>


            <Items />
            <Bag />


            <ambientLight intensity={0.5} />
            <directionalLight position={[-5, 10, 0]} intensity={1} />

            <color args={['#c5c5c5']} attach="background" />
        </Physics>

    </>
}

export default Experience