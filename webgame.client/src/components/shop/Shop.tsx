import { Item, Close } from "../../components";
import { type FC } from 'react';

type ShopProps = {
  isOpen: boolean,
  setIsOpen: (value: boolean) => void
}
const Shop: FC<ShopProps> = ({ isOpen, setIsOpen }) => {
  return (
    <div className="shop" style={{display: isOpen ? "block" : "none"}}>
      <Close className="shop__close" onToggle={() => setIsOpen(false)}></Close>
      <p className="shop__title">Obchod</p>
      <ul className="shop__list">
        <li><Item imgSrc="images/buildings/3.png" price={1100} onBuy={() => setIsOpen(false)}/></li>
        <li><Item imgSrc="images/buildings/6.png" price={500} onBuy={() => setIsOpen(false)}/></li>
        <li><Item imgSrc="images/buildings/2.png" price={235} onBuy={() => setIsOpen(false)}/></li>
      </ul>
    </div>
  )
}
export default Shop;