import { Link, useNavigate } from 'react-router-dom';
import { type FC, use, useState } from 'react';
import type { GameState } from "./../../types/gameModels";
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

type MenuProps = {
    gameStatePromise: Promise<GameState | null>;
    playerIdPromise: Promise<string>;
    onPlayerIdChange: (newId: string) => void;
}
const Menu: FC<MenuProps> = ({ gameStatePromise, playerIdPromise, onPlayerIdChange }) => {
    //Hooks
    const initialGameState: GameState | null = use<GameState | null>(gameStatePromise);
    const playerId: string = use<string>(playerIdPromise);
    const navigate = useNavigate();
    const [showCredits, setShowCredits] = useState<boolean>(false);
    const [showEnterId, setShowEnterId] = useState<boolean>(false);
    const [enteredId, setEnteredId] = useState<string>("");
    const [loadError, setLoadError] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const idRef = useRef<HTMLDivElement>(null);
    const buttonsRef = useRef<HTMLMenuElement>(null);
    const creditsRef = useRef<HTMLDivElement>(null);
    const enterIdRef = useRef<HTMLDivElement>(null);

    const handleLoadGame = async (): Promise<void> => {
        if (!enteredId.trim()) {
            setLoadError("Zadejte ID.");
            return;
        }
        try {
            const res = await fetch(`/api/game/state/${enteredId}`);
            if (res.ok) {
                onPlayerIdChange(enteredId);
                navigate("/game");
            } else {
                setLoadError("Hra s tímto ID neexistuje.");
            }
        } catch (e) {
            setLoadError("Chyba při načítání hry.");
        }
    };
    const handleNewGame = async (): Promise<void> => {
        try {
            const res = await fetch("/api/game/create");
            if (res.ok) {
                const newId = await res.text();
                onPlayerIdChange(newId);
                navigate("/game");
            } else {
                console.error("Failed to create new game");
            }
        } catch (e) {
            console.error("Error creating new game:", e);
        }
    };
    useGSAP(() => {
        const tl = gsap.timeline();
        tl.from(".menu__cloud", {
            opacity: 0,
            duration: 1.75,
            ease: "power2.easeInOut"
        }, 0);
        tl.from(titleRef.current, {
            scale: 0.5,
            opacity: 0,
            duration: 1.25,
            ease: "back.out(1.7)"
        }, 0.2);
    }, { scope: containerRef });
    useGSAP(() => {
        if (!showCredits && !showEnterId) {
            const tl = gsap.timeline();
            if (idRef.current) gsap.set(idRef.current, { opacity: 0, y: 50 });
            if (buttonsRef.current) gsap.set(buttonsRef.current.children, { opacity: 0, y: 30 });
            if (idRef.current) {
                tl.to(idRef.current, {
                    y: 0,
                    opacity: 1,
                    duration: 0.75,
                    ease: "power2.easeInOut"
                });
            }
            if (buttonsRef.current) {
                tl.to(buttonsRef.current.children, {
                    y: 0,
                    opacity: 1,
                    duration: 0.65,
                    stagger: 0.1,
                    ease: "power2.easeInOut"
                }, "-=0.3");
            }
        }
    }, { dependencies: [showCredits, showEnterId], scope: containerRef });
    useGSAP(() => {
        if (showCredits && creditsRef.current) {
            gsap.fromTo(creditsRef.current.children,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: "power2.easeInOut" }
            );
        }
    }, { dependencies: [showCredits], scope: containerRef });
    useGSAP(() => {
        if (showEnterId && enterIdRef.current) {
            gsap.fromTo(enterIdRef.current.children,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: "power2.easeInOut" }
            );
        }
    }, { dependencies: [showEnterId], scope: containerRef });
    return (
        <div className="menu" ref={containerRef}>
            <div className="menu__container">
                <div className="menu__container-title" ref={titleRef}>
                    <figure className="menu__container-title-figure">
                        <img className="img-responsive" src="images/content/sheep.png" alt="Obrázek ovce" loading="lazy" />
                    </figure>
                    <h1 className="menu__container-title-text">Clash Of Brynza</h1>
                    <figure className="menu__container-title-figure">
                        <img className="img-responsive" src="images/content/sheep.png" alt="Obrázek ovce" loading="lazy" />
                    </figure>
                </div>
                {!showCredits && !showEnterId && (
                    <>
                        <div className="menu__container-id" ref={idRef}>
                            <p className="menu__container-id-text">Tvoje id: <span className="menu__container-id-text-span">{playerId}</span></p>
                        </div>
                        <nav className="menu__container-nav">
                            <menu className="menu__container-nav-menu" ref={buttonsRef}>
                                <li className="menu__container-nav-menu-item">
                                    <Link className="menu__container-nav-menu-item-link" to="/game" style={!initialGameState ? { opacity: 0.5, pointerEvents: 'none' } : {}}>
                                        Pokračovat
                                    </Link>
                                </li>
                                <li className="menu__container-nav-menu-item"><button className="menu__container-nav-menu-item-button" onClick={handleNewGame}>Nová hra</button></li>
                                <li className="menu__container-nav-menu-item"><button className="menu__container-nav-menu-item-button" onClick={() => setShowEnterId(true)}>Načíst hru</button></li>
                                <li className="menu__container-nav-menu-item"><button className="menu__container-nav-menu-item-button" onClick={() => { setShowCredits(true) }}>Titulky</button></li>
                            </menu>
                        </nav>
                    </>
                )}
                {showCredits && (
                    <div ref={creditsRef} style={{ display: 'contents' }}>
                        <div className="menu__container-credits">
                            <h2 className="menu__container-credits-title">Vytvořili:</h2>
                            <p className="menu__container-credits-text">Bob Čermák a Víťa Dobrovský</p>
                        </div>
                        <div className="menu__container-back-credits">
                            <button className="menu__container-back-button" onClick={() => { setShowCredits(false) }}>Zpět</button>
                        </div>
                    </div>
                )}
                {showEnterId && (
                    <div ref={enterIdRef} style={{ display: 'contents' }}>
                        <div className="menu__container-enter-id">
                            <input
                                className="menu__container-enter-id-input"
                                type="text"
                                placeholder="Zadejte ID:"
                                value={enteredId}
                                onChange={(e) => {
                                    setEnteredId(e.target.value.toLowerCase().trim());
                                    setLoadError(null);
                                }}
                            />
                            {loadError && <p className="menu__container-enter-id-error">{loadError}</p>}
                        </div>
                        <nav className="menu__container-nav">
                            <menu className="menu__container-nav-menu">
                                <li className="menu__container-nav-menu-item">
                                    <button className="menu__container-nav-menu-item-button" onClick={handleLoadGame}>
                                        Pokračovat
                                    </button>
                                </li>
                                <li className="menu__container-nav-menu-item"><button className="menu__container-nav-menu-item-button" onClick={() => setShowEnterId(false)}>Zpět</button></li>
                            </menu>
                        </nav>
                    </div>
                )}
            </div>
            <figure className="menu__cloud menu__cloud-1">
                <img className="img-responsive" src="images/content/cloud-t-l.png" alt="Obrázek oblak" loading="lazy" />
            </figure>
            <figure className="menu__cloud menu__cloud-2">
                <img className="img-responsive" src="images/content/cloud-t-r.png" alt="Obrázek oblak" loading="lazy" />
            </figure>
            <figure className="menu__cloud menu__cloud-3">
                <img className="img-responsive" src="images/content/cloud-b-l.png" alt="Obrázek oblak" loading="lazy" />
            </figure>
        </div>
    );
};
export default Menu;