import { useRouter } from "next/router";
import { useAuth } from "../auth/AuthProvider";
import Navbar, { NavbarProps } from "../ui/Navbar";

interface MainLayoutProps {
    navbarSize?: NavbarProps["size"];
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, navbarSize }) => {
    const { push } = useRouter();
    const { isAuthenticated, logout } = useAuth();

    const buttonSpacing: NavbarProps["buttonSpacing"] = isAuthenticated ? 6 : 3;

    const loggedInNavbarMenuItems: NavbarProps["items"] = isAuthenticated
        ? [
              {
                  text: "my flags",
                  url: "/flags",
                  variant: "link",
                  colorScheme: "gray",
              },
              {
                  text: "about",
                  url: "/about",
                  variant: "link",
                  colorScheme: "gray",
              },
              {
                  text: "editor",
                  url: "/editor",
              },
          ]
        : undefined;

    const loggedInNavbarDropdown: NavbarProps["endDropdownItem"] = isAuthenticated
        ? {
              text: "my account",
              variant: "outline",
              items: [
                  {
                      text: "sign out",
                      onItemClicked: async () => {
                          await logout();
                          push("/");
                      },
                  },
              ],
          }
        : undefined;

    return (
        <>
            <Navbar
                size={navbarSize}
                homeItem={{ text: "flaggin", url: "/" }}
                buttonSpacing={buttonSpacing}
                items={loggedInNavbarMenuItems}
                endDropdownItem={loggedInNavbarDropdown}
            />
            {children}
        </>
    );
};

export default MainLayout;
