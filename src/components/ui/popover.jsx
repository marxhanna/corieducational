import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import PropTypes from "prop-types";
import { clsx } from "clsx";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;

export const PopoverContent = React.forwardRef(
  ({ className, align = "center", sideOffset = 4, ...props }, ref) => (
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={clsx(
        "z-50 w-72 rounded-md border bg-popover p-4 shadow-md outline-none",
        className
      )}
      {...props}
    />
  )
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

PopoverContent.propTypes = {
  className: PropTypes.string,
  align: PropTypes.string,
  sideOffset: PropTypes.number,
};
