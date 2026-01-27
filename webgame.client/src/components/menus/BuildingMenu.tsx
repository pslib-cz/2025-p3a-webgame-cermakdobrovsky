import { Close, Button } from "../../components";
import { type FC } from "react";
import { type Building } from "../../../types/mapModels";

type BuildingMenuProps = {
  isOpen: boolean;
  building?: Building;
  onClose: () => void;
  onDeleteBuilding?: () => void;
};
const BuildingMenu: FC<BuildingMenuProps> = ({ isOpen, building, onClose, onDeleteBuilding }) => {
  return (
    <>
      {isOpen !== null && (
        <div className="page__building-menu">
          <div className="building-menu" style={{ display: isOpen ? "block" : "none" }}>
            <div className="building-menu__wrapper">
              <Close className="building-menu__close" onToggle={onClose} />
              <p className="building-menu__title">{building?.name}</p>
              <div className="building-menu__description">
                <p className="building-menu__description-text">{building?.description}</p>
                <div className="building-menu__description-content">
                  <p className="building-menu__description-content-text">Efektivita:</p>
                  <div className="building-menu__resource">
                    <p className="building-menu__resource-amount">10</p>
                    <figure className="building-menu__resource-figure">
                      <img className="img-responsive" src="images/content/sheep.png" alt="Obrázek ovce" loading="lazy" />
                    </figure>
                  </div>
                  <p className="building-menu__description-content-time">/ 30s</p>
                </div>
              </div>
              <div className="building-menu__upgrade-section">
                <div>
                  <p className="building-menu__upgrade-title">Vylepšení:</p>
                  <div className="building-menu__amount">
                    <p className="building-menu__amount-text">240</p>
                    <figure className="building-menu__amount-figure">
                      <img className="img-responsive" src="images/content/sheep.png" alt="Obrázek ovce" loading="lazy" />
                    </figure>
                  </div>
                </div>
                <Button className="building-menu__upgrade-button" onClick={onClose}>
                  Vylepšit
                </Button>
              </div>
              {!building?.isTownHall && (
                <Button className="building-menu__upgrade-button" onClick={() => onDeleteBuilding?.()}>
                  Odstranit
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default BuildingMenu;
