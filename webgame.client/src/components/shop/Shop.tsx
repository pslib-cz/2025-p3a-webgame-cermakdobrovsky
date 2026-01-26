import { Item, Close, SwiperPrimary } from "../../components";
import { type FC } from "react";
import { type Building } from "../../../types/mapModels";

type ShopProps = {
  isOpen: boolean;
  buildings: Building[];
  setIsOpen: (value: boolean) => void;
  onBuildingBuy?: (building: Building) => void;
};
const Shop: FC<ShopProps> = ({ isOpen, buildings, setIsOpen, onBuildingBuy }) => {
  return (
    <div className="shop" style={{ display: isOpen ? "block" : "none" }}>
      <Close className="shop__close" onToggle={() => setIsOpen(false)}></Close>
      <p className="shop__title">Obchod</p>
      <SwiperPrimary>
        {buildings
          .filter((building: Building) => building.buildingId !== 1)
          .map((building: Building) => (
            <Item imgSrc={building.imageUrl} price={building.initialCost} onBuy={() => onBuildingBuy?.(building)} />
          ))}
      </SwiperPrimary>
    </div>
  );
};
export default Shop;
