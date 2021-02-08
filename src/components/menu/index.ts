import GIOMenu from './Menu';
import MenuItem from './MenuItem';
import SubMenu from './SubMenu';
import Divider from './Divider';

export {
  IMenuProps as MenuProps,
  ISubMenuProps as SubMenuProps,
  IMenuItemProps as MenuItemProps,
  TMenuMode as MenuMode,
  DividerProps,
} from './interface';

export type TMenu = typeof GIOMenu & {
  MenuItem: typeof MenuItem;
  SubMenu: typeof SubMenu;
};

const Menu = GIOMenu as TMenu;
Menu.MenuItem = MenuItem;
Menu.SubMenu = SubMenu;

export default Menu;
export { MenuItem, SubMenu, Divider };