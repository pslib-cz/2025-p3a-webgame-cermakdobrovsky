import { type FC } from 'react';

type ReasourceProps = {
  currentAmount: number,
  maxAmount?: number,
  maxWidth?: string,
  imgSrc: string,
  color: string
}
const Resource: FC<ReasourceProps> = ({ currentAmount, maxAmount, maxWidth, imgSrc, color }) => {
  let width = 0;
  if (maxAmount && maxAmount > 0) width = (currentAmount / maxAmount) * 100;
  else {
    const softLimit = 100;
    width = 40 + (currentAmount / (currentAmount + softLimit)) * 60;
  }
  width = Math.min(Math.max(width, 0), 100);
  return (
    <div className="resource" style={{ width: maxWidth }}>
      <figure>
        <img className="img-responsive" src={imgSrc} alt="Obrázek zdroje" loading='lazy' />
      </figure>
      <div style={{ backgroundColor: color, width: `${width}%` }}>
        <p className="resource__amount">{currentAmount}</p>
      </div>
    </div>
  )
}
export default Resource;