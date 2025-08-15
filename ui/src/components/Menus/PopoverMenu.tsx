import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
type MenuItem = {
  path: string;
  onClick: () => void;
};
type PopoverMenuProps = {
  menuItems: MenuItem[];
  icon?: React.ReactNode;
  className?: string;
};
const PopoverMenu: React.FC<PopoverMenuProps> = ({
  menuItems,
  icon,
  className = "",
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={`rounded-full bg-off-white text-md ${className}`}
        >
          {icon && icon}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="grid gap-2">
          {menuItems?.map((menu, i) => (
            <Button
              variant="ghost"
              className="w-full justify-start cursor-pointer"
              key={i}
              onClick={() => menu.onClick()}
            >
              {menu.path}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverMenu;
