export interface NavItem {
  title: string;
  href: string;
  icon: string;
}

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: "Package",
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: "FolderTree",
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: "Receipt",
  },
  {
    title: "Custom Clocks",
    href: "/admin/custom-clocks",
    icon: "Clock",
  },
];

