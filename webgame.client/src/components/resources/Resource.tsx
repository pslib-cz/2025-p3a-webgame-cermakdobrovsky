import { type FC } from 'react';

type ReasourceProps = {
  currentAmount: number,
  maxWidth?: string,
  imgSrc: string,
  color: string
}
const Resource: FC<ReasourceProps> = ({ currentAmount, maxWidth, imgSrc, color }) => {
  return (
    <div className="resource" style={{ width: maxWidth }}>
      <figure>
        <img className="img-responsive" src={imgSrc} alt="Obrázek zdroje" loading='lazy'/>
      </figure>
      <div style={{backgroundColor: color, width: `70%`}}>
        <p className="resource__amount">{currentAmount}</p>
      </div>
    </div>
  )
}
export default Resource;