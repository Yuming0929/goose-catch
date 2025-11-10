// import { Perf } from 'r3f-perf'
import { Canvas, } from '@react-three/fiber'
// import { OrbitControls } from '@react-three/drei'
import Experience from './Experience'
import { Loader, useProgress } from '@react-three/drei'
import { useGameStore } from './stores/useGameStore'
import { Suspense } from 'react'
import { Pause } from 'lucide-react'
import UI from './components/UI'
import CountDown from './components/CountDown'

function App() {

  const pauseGame = useGameStore((state) => state.paused);
  // const gamePhase = useGameStore((state) => state.gamePhase);
  const itemsLeft = useGameStore((state) => state.itemsLeft);
  const { progress } = useProgress();


  return (
    <div className='app'>

      <div className='wrapper'>
        <div className='camera'></div>

        <div className='indicator'>{itemsLeft} left</div>
        <div className='pause-button' onClick={pauseGame}><Pause/></div>
        <div className='count-down'><CountDown /></div>
        <Canvas
          id='r3f-canvas'
          camera={{ position: [0, 15, 4], fov: 50 }}
          
        >

          <Suspense fallback={null} >
            {/* <Perf position="top-left" /> */}
            {/* <Grid args={[10, 10]} sectionSize={1} infiniteGrid={false} /> */}
            {/* <PerspectiveCamera makeDefault position={[0, 8, 0]} /> */}
            {/* <OrbitControls /> */}
            <Experience />
          </Suspense>
        </Canvas>
        <Loader
          containerStyles={{ backgroundColor: 'black', borderRadius: '40px' }}
          innerStyles={{ color: 'white' }}
          dataStyles={{ color: 'white' }}
          barStyles={{ backgroundColor: 'orange' }}
          dataInterpolation={(p) => `加载中 ${p.toFixed(2)} %`}
          initialState={(active) => active}
        />

        {/* Game interface */}
        {
          progress === 100 && <UI />
        }

      </div>
    </div>
  )
}

export default App
