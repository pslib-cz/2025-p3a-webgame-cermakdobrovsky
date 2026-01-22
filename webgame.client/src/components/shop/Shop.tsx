import { Item, Close, SwiperPrimary } from "../../components";
import { type FC } from 'react';
import { type Building } from "../../../types/mapModels";

type ShopProps = {
  isOpen: boolean,
  buildings: Building[],
  setIsOpen: (value: boolean) => void
}
const Shop: FC<ShopProps> = ({ isOpen, buildings, setIsOpen }) => {
  return (
    <div className="shop" style={{ display: isOpen ? "block" : "none" }}>
      <Close className="shop__close" onToggle={() => setIsOpen(false)}></Close>
      <p className="shop__title">Obchod</p>
      <SwiperPrimary>
        {buildings.filter((building: Building) => building.buildingId !== 1).map((building: Building) => (
          <Item imgSrc={building.imageUrl} price={building.initialCost} onBuy={() => setIsOpen(false)}/>
        ))}
      </SwiperPrimary>
      <ul className="shop__list">
        {buildings.filter((building: Building) => building.buildingId !== 1).map((building: Building) => (
          <li key={building.buildingId}>
            <Item imgSrc={building.imageUrl} price={building.initialCost} onBuy={() => setIsOpen(false)}/>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default Shop;