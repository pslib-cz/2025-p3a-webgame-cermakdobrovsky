import { type FC } from 'react';

type ReasourceProps = {
    maxAmount: number,
    currentAmount: number,
    maxWidth?: string,
    imgSrc: string,
    color: string
}
const Resource: FC<ReasourceProps> = ({ maxAmount, currentAmount, maxWidth, imgSrc, color }) => {
  return (
    <div className="resource" style={{ width: maxWidth }}>
      <div style={{backgroundColor: color, width: `${(currentAmount / maxAmount) * 100}%`}}>
        <p className="resource__amount">{currentAmount}</p>
      </div>
    </div>
  )
}
export default Resource;