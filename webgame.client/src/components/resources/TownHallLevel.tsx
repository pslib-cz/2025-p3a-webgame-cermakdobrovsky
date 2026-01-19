import { type FC } from "react";

type TownHallLevelProps = {
    currentLevel: number,
    className?: string
}
const TownHallLevel: FC<TownHallLevelProps> = ({ currentLevel, className }) => {
  return (
    <div className={`town-hall-level ${className}`}>
        <span className="town-hall-level__span">
            <p>{currentLevel}</p>
        </span>
    </div>
  )
}
export default TownHallLevel;