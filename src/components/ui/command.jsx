import * as React from "react";
import PropTypes from "prop-types";
import { clsx } from "clsx";

export const Command = ({ children, className, ...props }) => (
  <div
    className={clsx(
      "relative flex flex-col overflow-hidden rounded-lg bg-white shadow-md",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

// Adicionando a validação de props
Command.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const CommandInput = React.forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={clsx("w-full p-2 text-sm bg-gray-100 rounded-md", className)}
    {...props}
  />
));
CommandInput.displayName = "CommandInput";

// Adicionando a validação de props
CommandInput.propTypes = {
  className: PropTypes.string,
};

export const CommandList = ({ children }) => (
  <div className="flex-1 overflow-auto">{children}</div>
);

// Adicionando a validação de props
CommandList.propTypes = {
  children: PropTypes.node.isRequired,
};

export const CommandEmpty = () => (
  <div className="p-4 text-center text-sm">Nenhuma opção encontrada.</div>
);

export const CommandGroup = ({ children, label }) => (
  <div className="p-2">
    <div className="text-sm font-medium text-gray-500">{label}</div>
    {children}
  </div>
);

// Adicionando a validação de props
CommandGroup.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string,
};

export const CommandItem = React.forwardRef(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        "flex items-center p-2 cursor-pointer rounded-md hover:bg-gray-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
CommandItem.displayName = "CommandItem";

// Adicionando a validação de props
CommandItem.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
