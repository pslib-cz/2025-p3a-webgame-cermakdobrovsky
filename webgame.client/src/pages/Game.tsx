import { type FC, use, useState, useRef, useEffect } from "react";
import type { GameState } from "./../../types/gameModels";
import type { Building, Map, MapBuilding } from "./../../types/mapModels";
import MapCanvas from "./../map/MapCanvas";
import { Button, Resource, TownHallLevel, Shop, BuildingMenu } from "./../components";
import { useDebugMode } from "./../hooks/useDebugMode";
import { getBuildingImageUrl, setFixedImageForBuilding } from "../../lib/helpers/randomImage";
import { addBuilding, deleteBuilding, upgradeBuilding } from "../../lib/mapUtils";
import { Link } from "react-router-dom";

type GameProps = {
    groundMapPromise: Promise<Map>;
    buildingsPromise: Promise<Building[]>;
    gameStatePromise: Promise<GameState>;
}
const Game: FC<GameProps> = ({ groundMapPromise, buildingsPromise, gameStatePromise }) => {
    //Hooks
    const groundMap: Map = use<Map>(groundMapPromise);
    const initialGameState: GameState = use<GameState>(gameStatePromise);
    const [gameState, setGameState] = useState<GameState>(initialGameState);
    const buildings: Building[] = use<Building[]>(buildingsPromise);
    const [isOpenShop, setIsOpenShop] = useState<boolean>(false);
    const [placingBuilding, setPlacingBuilding] = useState<Building | null>(null);
    const [currentBuilding, setCurrentBuilding] = useState<MapBuilding | null>(null);
    const shopButtonRef = useRef<HTMLLIElement>(null);
    const { debugMode, toggleDebugMode } = useDebugMode();
    const [inStarvation, setInStarvation] = useState<boolean>(false);
    const [displayError, setDisplayError] = useState<string | null>(null);
    const [isAddBuildingError, setIsAddBuildingError] = useState<{ error: boolean, message: string }>({
        error: false,
        message: ""
    });
    const [isDeleteBuildingError, setIsDeleteBuildingError] = useState<{ error: boolean, message: string }>({
        error: false,
        message: ""
    });
    const [isUpgradeBuildingError, setIsUpgradeBuildingError] = useState<{ error: boolean, message: string }>({
        error: false,
        message: ""
    });

    useEffect(() => {
        if (isAddBuildingError.error) setDisplayError(isAddBuildingError.message);
    }, [isAddBuildingError]);
    useEffect(() => {
        if (isDeleteBuildingError.error) setDisplayError(isDeleteBuildingError.message);
    }, [isDeleteBuildingError]);
    useEffect(() => {
        if (isUpgradeBuildingError.error) setDisplayError(isUpgradeBuildingError.message);
    }, [isUpgradeBuildingError]);
    useEffect(() => {
        if (!isAddBuildingError.error && !isDeleteBuildingError.error && !isUpgradeBuildingError.error) {
            setDisplayError(null);
        }
    }, [isAddBuildingError, isDeleteBuildingError, isUpgradeBuildingError]);
    const activeError = displayError ? { message: displayError } : null;
    useEffect(() => {
        if (isAddBuildingError.error || isDeleteBuildingError.error || isUpgradeBuildingError.error) {
            const timer = setTimeout(() => {
                setIsAddBuildingError(prev => ({ ...prev, error: false }));
                setIsDeleteBuildingError(prev => ({ ...prev, error: false }));
                setIsUpgradeBuildingError(prev => ({ ...prev, error: false }));
            }, 2600);
            return () => clearTimeout(timer);
        }
    }, [isAddBuildingError, isDeleteBuildingError, isUpgradeBuildingError]);
    //Advance game every 5 seconds
    useEffect(() => {
        const interval = setInterval(async () => {
            if (gameState?.playerId) {
                const response = await fetch(`/api/game/advance/${gameState.playerId}`);
                if (response.ok) {
                    const updatedState = await response.json();
                    setGameState(updatedState);
                    if (updatedState.sheep < updatedState.population) {
                        setInStarvation(true);
                    } else {
                        setInStarvation(false);
                    }
                }
            }
        }, 2500);
        return () => clearInterval(interval);
    }, [gameState?.playerId]);
    const handleUpgradeBuilding = async (mapBuilding: MapBuilding) => {
        const data = await upgradeBuilding(mapBuilding, setIsUpgradeBuildingError);
        if (data) {
            setGameState(data);
            const updatedBuilding = data.buildingMap.buildings.find((b) => b.mapId === mapBuilding.mapId && b.bottomLeftX === mapBuilding.bottomLeftX && b.bottomLeftY === mapBuilding.bottomLeftY);
            if (updatedBuilding) setCurrentBuilding(updatedBuilding);
        }
        else setCurrentBuilding(null);
    };
    const handleAddBuilding = async (buildingId: number, bottomLeftX: number, bottomLeftY: number) => {
        const data = await addBuilding(buildingId, bottomLeftX, bottomLeftY, gameState.playerId, setIsAddBuildingError);
        if (data) setGameState(data);
    };
    const handleDeleteBuilding = async (mapBuilding: MapBuilding) => {
        const data = await deleteBuilding(mapBuilding, setIsDeleteBuildingError);
        if (data) setGameState(data);
        setCurrentBuilding(null);
    };
    return (
        <>
            <button
                onClick={toggleDebugMode}
                style={{
                    position: "fixed",
                    bottom: "10px",
                    left: "10px",
                    zIndex: 9999,
                    padding: "8px 12px",
                    background: debugMode ? "#4CAF50" : "#666666",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                }}
            >
                Debug: {debugMode ? "ON" : "OFF"}
            </button>
            <div className="page">
                {inStarvation && (
                    <div className="starvation-alert">
                        <div className="starvation-alert__border" />
                        <p className="starvation-alert__banner">⚠️ Kritický nedostatek ovcí! Populace požírá chovné stádo. Zbourej budovy a zmenší populaci, než snědí i <strong>poslední ovci</strong>!</p>
                    </div>
                )}
                {activeError && (
                    <div className="error-alert">
                        <p className="error-alert__banner">❌ {activeError.message} ❌</p>
                    </div>
                )}
                <div className="page__townhall-level">
                    <TownHallLevel currentLevel={gameState.level} />
                    <p className="user-id">id: <span>{gameState.playerId}</span></p>
                </div>
                <Shop
                    isOpen={isOpenShop}
                    buildings={buildings}
                    onClose={() => setIsOpenShop(false)}
                    onBuildingBuy={(building) => {
                        const selectedUrl = getBuildingImageUrl(building.imageUrl);
                        const modifiedBuilding = { ...building, imageUrl: selectedUrl };
                        setPlacingBuilding(modifiedBuilding);
                        setIsOpenShop(false);
                    }}
                />
                <BuildingMenu
                    onBuildingUpgrade={handleUpgradeBuilding}
                    onDeleteBuilding={handleDeleteBuilding}
                    isOpen={currentBuilding !== null}
                    building={currentBuilding ?? undefined}
                    onClose={() => setCurrentBuilding(null)}
                />
                <ul className="page__resources-area">
                    <li>
                        <Resource maxWidth="300px" imgSrc="images/content/sheep.png" color="#9B7260" maxAmount={gameState.maxSheep} currentAmount={gameState.sheep} />
                    </li>
                    <li>
                        <Resource maxWidth="250px" imgSrc="images/content/monk.png" color="#4795A7" maxAmount={gameState.maxPopulation} currentAmount={gameState.population} />
                    </li>
                    <li>
                        <Resource maxWidth="200px" imgSrc="images/content/grass.png" color="#455A4B" maxAmount={100} currentAmount={Math.floor((gameState.freeSpace / 1513) * 100)} />
                    </li>
                </ul>
                <ul className="page__buttons-area">
                    {placingBuilding ? (
                        <li>
                            <Button onClick={() => setPlacingBuilding(null)} variant="secondary" imgSrc="images/content/house.png">
                                Zrušit
                            </Button>
                        </li>
                    ) : (
                        <>
                            <li>
                                <Button variant="secondary" imgSrc="images/content/warrior.png">
                                    Útok
                                </Button>
                            </li>
                            <li ref={shopButtonRef}>
                                <Button onClick={() => setIsOpenShop(true)} variant="secondary" bgColor="button--secondary--blue" imgSrc="images/content/house.png">
                                    Stavět
                                </Button>
                            </li>
                        </>
                    )}
                </ul>
                <div className="page__home-button">
                    <Link to="/">
                        <Button variant="secondary" bgColor="button--secondary--blue" smallerImg={true} imgSrc="images/content/arrow.png">
                            Domů
                        </Button>
                    </Link>
                </div>
                {gameState && (
                    <MapCanvas
                        groundMap={groundMap}
                        buildingsMap={gameState.buildingMap}
                        tileSize={54}
                        placingBuilding={placingBuilding}
                        onMapClick={(x, y) => {
                            if (placingBuilding !== null) {
                                handleAddBuilding(placingBuilding.buildingId, x, y);
                                setFixedImageForBuilding(x, y, placingBuilding.imageUrl);
                                setPlacingBuilding(null);
                            }
                        }}
                        onBuildingClick={(building) => {
                            if (placingBuilding === null) setCurrentBuilding(building);
                        }}
                        inStarvation={inStarvation}
                    />
                )}
            </div>
        </>
    );
};
export default Game;