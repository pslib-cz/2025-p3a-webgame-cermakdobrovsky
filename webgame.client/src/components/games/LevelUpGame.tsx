import { type FC, useState, useEffect, useRef } from "react";
import { Button } from "../../components";

type LevelUpGameProps = {
  currentLevel: number
};

const LevelUpGame: FC<LevelUpGameProps> = ({ currentLevel }) => {
  const maxLevels = 10;
  //Hooks
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [enemies, setEnemies] = useState<{ id: number; src: string; x: number; y: number; angle: number }[]>([]);
  const [stuckSwords, setStuckSwords] = useState<number[]>([]);
  const [isReloading, setIsReloading] = useState<boolean>(false);
  const circleRef = useRef<HTMLElement>(null);
  const rotationRef = useRef(0);
  const speedRef = useRef(0);
  const isReloadingRef = useRef(false);

  const initializeGame = () => {
    const newEnemies = Array.from({ length: 6 }).map((_, index) => {
      const angleDeg = index * 60;
      const angleRad = angleDeg * (Math.PI / 180);
      const radius = 135;
      const x = Math.cos(angleRad) * radius;
      const y = Math.sin(angleRad) * radius;
      return {
        id: index,
        src: Math.random() > 0.5 ? "images/content/enemy-1.png" : "images/content/enemy-2.png",
        x,
        y,
        angle: angleDeg
      };
    });
    setEnemies(newEnemies);
    setStuckSwords([]);
    setGameOver(false);
    setIsPlaying(false);
    rotationRef.current = 0;
    if (circleRef.current) {
        circleRef.current.style.transform = `rotate(0deg)`;
    }
  };
  const handleShoot = () => {
    if (gameOver) {
        initializeGame();
        return;
    }
    if (!isPlaying) {
      setIsPlaying(true);
      return; 
    }
    if (isReloadingRef.current) return;
    setIsReloading(true);
    isReloadingRef.current = true;
    setTimeout(() => {
      setIsReloading(false);
      isReloadingRef.current = false;
    }, 300); 
    const currentRotation = rotationRef.current % 360;
    let hitAngle = (90 - currentRotation) % 360;
    if (hitAngle < 0) hitAngle += 360;
    const hitSwordCollision = stuckSwords.some(swordAngle => {
        const diff = Math.abs(swordAngle - hitAngle);
        const normalizedDiff = Math.min(diff, 360 - diff);
        return normalizedDiff < 15; 
    });
    if (hitSwordCollision) {
        setGameOver(true);
        setIsPlaying(false);
        return; 
    }
    setStuckSwords(prev => [...prev, hitAngle]);
    const hitEnemyIndex = enemies.findIndex(enemy => {
      const diff = Math.abs(enemy.angle - hitAngle);
      const normalizedDiff = Math.min(diff, 360 - diff);
      return normalizedDiff < 20; 
    });
    if (hitEnemyIndex !== -1) {
      setEnemies(prev => prev.filter((_, i) => i !== hitEnemyIndex));
    }
  };
  useEffect(() => {
    initializeGame();
  }, []);
  useEffect(() => {
    let animationFrameId: number;
    if (!isPlaying || gameOver) return;
    const animate = () => {
      const baseSpeed = 0.2 + currentLevel * 0.1;
      if (Math.random() < 0.005 + currentLevel * 0.002) {
        speedRef.current += 2 + currentLevel * 0.5;
      }
      speedRef.current *= 0.95;
      rotationRef.current += baseSpeed + speedRef.current;
      if (circleRef.current) {
        circleRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [currentLevel, isPlaying, gameOver]);
  return (
    <div className="level-up-game">
      <div className="level-up-game__dots-map" style={{ opacity: isPlaying ? 0 : 100, transition: 'opacity 0.25s ease-in-out' }}>
        {Array.from({ length: maxLevels }, (_, index) => (
          <span
            key={index}
            className={`level-up-game__dot ${index < currentLevel ? 'level-up-game__dot--active' : ''}`}
          />
        ))}
      </div>
      <figure className="level-up-game__circle" ref={circleRef} style={{ position: 'relative' }}>
        <img className="img-responsive" src="images/content/circle.webp" alt="Obrázek populace" loading="lazy" />
        {enemies.map((enemy) => (
          <img
            key={enemy.id}
            src={enemy.src}
            alt="Enemy"
            className="level-up-game__enemy"
            style={{
              left: `calc(50% + ${enemy.x}px)`,
              top: `calc(50% + ${enemy.y}px)`,
              zIndex: 1, 
            }}
          />
        ))}
        {stuckSwords.map((angle, index) => {
          const angleRad = angle * (Math.PI / 180);
          const radius = 110; 
          const x = Math.cos(angleRad) * radius;
          const y = Math.sin(angleRad) * radius;
          return (
            <img
              key={`sword-${index}`}
              src="images/content/sword.png"
              alt="Sword"
              style={{
                position: 'absolute',
                width: '30px',
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: `translate(-50%, -50%) rotate(${angle - 90}deg)`,
                pointerEvents: 'none',
                zIndex: -1
              }}
            />
          )
        })}
      </figure>
      <div className="level-up-game__content">
        <figure className="level-up-game__content-img" style={{ opacity: isReloading || gameOver ? 0 : 1, transition: 'opacity 0.25s ease-in-out' }}>
          <img className="img-responsive" src="images/content/sword.png" alt="Obrázek populace" loading="lazy"/>
        </figure>
        <Button bgColor={gameOver ? "button--primary--red" : "button--primary--blue"} onClick={handleShoot}>
            {gameOver ? "Restartovat" : isPlaying ? "Střelit" : "Začít"}
        </Button>
      </div>
    </div>
  )
}
export default LevelUpGame;