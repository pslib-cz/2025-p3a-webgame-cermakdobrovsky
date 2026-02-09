import { type FC } from "react";
import { useAudio } from "../../hooks/useAudio";

type ButtonProps = {
  variant?: "primary" | "secondary";
  bgColor?: "button--primary--blue" | "button--primary--red" | "button--secondary--brown" | "button--secondary--blue";
  imgSrc?: string;
  smallerImg?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
};
const Button: FC<ButtonProps> = ({ variant = "primary", bgColor = "button--secondary--brown", imgSrc, smallerImg = false, className, onClick, children }) => {
  //Hooks
  const { playSFX } = useAudio();

  //Styles
  const baseStyles: string = "button";
  const variantStyles: Record<"primary" | "secondary", string> = {
    primary: `button--primary ${bgColor}`,
    secondary: `${smallerImg ? "button--secondary--small" : "button--secondary"} ${bgColor}`,
  };
  //Functions
  const handleDelayedClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playSFX("/audios/button-click.mp3");
    if (onClick) {
      setTimeout(() => {
        onClick(e);
      }, 250);
    }
  };
  return (
    <>
      <button className={`${baseStyles} ${variantStyles[variant]} ${className}`} onClick={(e) => handleDelayedClick(e)}>
        {imgSrc && variant === "secondary" && (
          <figure>
            <img src={imgSrc} alt="Obrázek tlačítka" />
          </figure>
        )}
        <span>{children}</span>
      </button>
    </>
  );
};
export default Button;
