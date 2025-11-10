
import { Play, RotateCcw } from "lucide-react";
import { useGameStore } from "../stores/useGameStore";

const UI = () => {

    const gamePhase = useGameStore((state) => state.gamePhase);
    const gameStore = useGameStore();
    const handleStart = () => gameStore.start();
    const handleStartOver = () => {
        gameStore.end();
        setTimeout(() => {
            gameStore.start();
        }, 50);
    };

    const handleResume = () => gameStore.resume();
    return (
        <>
            {(gamePhase !== 'playing') && (
                <div className='ui-container'>
                    <div className="menu">
                        <div className="title">抓大鹅 - R3F</div>
                        {gamePhase === 'ready' && (
                            <button onClick={handleStart}><Play size={20}/>开始</button>
                        )}
                        {(gamePhase === 'paused') && (
                            <>
                                
                                <button onClick={handleResume}><Play size={20}/>继续</button>
                                <button onClick={handleStartOver}><RotateCcw size={20}/>重来</button>
                            </>
                        )}
                        {(gamePhase === 'win' || gamePhase === 'gameover') && (
                            <>
                                {gamePhase === 'win' ?
                                    <div className="win-title">你赢了！</div> :
                                    <div className="loss-title">游戏结束！可惜可惜</div>}
                                <button onClick={handleStartOver}><RotateCcw size={20}/>再来</button>
                            </>
                        )}
                        <footer>
                            <div className="footer-text"><a
                                href="https://yuminghuang.com"
                                target="_blank"
                            >@Yuming Huang</a></div>
                            <div className="footer-text"><a
                                href="https://github.com/Yuming0929/goose-catch/tree/main"
                                target="_blank"
                            >Github Repo</a></div>
                        </footer>
                    </div>
                </div>

            )}


        </>

    )
}

export default UI;