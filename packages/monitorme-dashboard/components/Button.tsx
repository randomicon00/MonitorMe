import React from "react";
import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  customClass?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  href?: string; // If href is passed, render a link instead of a button
} & (
  | { Icon?: undefined; iconPosition?: never } // No Icon, no iconPosition
  | {
      Icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
      iconPosition: "left" | "right";
    }
); // Icon provided, require iconPosition

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary", // Default variant is primary
  customClass = "",
  disabled = false,
  type = "button",
  href, // Added href for link
  Icon,
  iconPosition = "left",
}) => {
  const baseStyle =
    "inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 whitespace-nowrap";

  // Define variants
  const styles = {
    primary:
      "text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 border-transparent",
    secondary:
      "text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500 border-transparent",
  };

  const buttonStyle = `${baseStyle} ${styles[variant]} ${customClass}`;

  // If href is provided, render a link instead of a button
  if (href) {
    return (
      <Link href={href} className={buttonStyle}>
        {Icon && iconPosition === "left" && (
          <span className="mr-2">
            <Icon className="h-7 w-7" />
          </span>
        )}
        {children}
        {Icon && iconPosition === "right" && (
          <span className="ml-2">
            <Icon className="h-7 w-7" />
          </span>
        )}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonStyle}
      disabled={disabled}
    >
      {Icon && iconPosition === "left" && (
        <span className="mr-2">
          <Icon className="h-7 w-7" />
        </span>
      )}
      {children}
      {Icon && iconPosition === "right" && (
        <span className="ml-2">
          <Icon className="h-7 w-7" />
        </span>
      )}
    </button>
  );
};

export default Button;
