import { type FC } from "react";

type ButtonProps = {
  variant?: "primary" | "secondary",
  bgColor?: "button--secondary--brown" | "button--secondary--blue",
  imgSrc?: string,
  className?: string,
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void,
  children: React.ReactNode
}
const Button: FC<ButtonProps> = ({ variant = "primary", bgColor = "button--secondary--brown", imgSrc, className, onClick, children }) => {
  const baseStyles: string = "button";
  const variantStyles: Record<"primary" | "secondary", string> = {
    primary: "button--primary",
    secondary: `button--secondary ${bgColor}`,
  };
  return (
    <>
      <button className={`${baseStyles} ${variantStyles[variant]} ${className}`} onClick={onClick}>{imgSrc && variant === "secondary" && <figure><img src={imgSrc} alt="Obrázek tlačítka"/></figure>}{children}</button>
      </>
    )
}
export default Button;