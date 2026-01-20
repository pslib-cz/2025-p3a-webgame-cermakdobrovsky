import { Button } from "../../components"
import { type FC } from 'react'

type ItemProps = {
    imgSrc: string,
    price: number,
    onBuy: () => void
}
const Item: FC<ItemProps> = ({ imgSrc, price, onBuy }) => {
  return (
    <div className="item">
        <figure>
            <img className="img-responsive" src={imgSrc} alt="Obrázek ovce" loading='lazy'/>
        </figure>
        <div>
            <p className="item__content">{price}</p>
            <figure>
                <img className="img-responsive" src="images/content/sheep.png" alt="Obrázek ovce" loading='lazy'/>
            </figure>
        </div>
        <div>
            <Button onClick={onBuy}>Koupit</Button>
        </div>
    </div>
  )
}
export default Item;