import Logo from "../components/Logo";
import Button from "../components/Button";
import { ChevronDown } from "../components/Icons";

const NAV_ITEMS = [
  { label: "Home", href: "#", chevron: false },
  { label: "Features", href: "#", chevron: true },
  { label: "Product", href: "#", chevron: true },
  { label: "Pricing", href: "#", chevron: false },
  { label: "Resource", href: "#", chevron: false },
];

/**
 * Site header: logo left, centered nav (with dropdown chevrons),
 * Login/Register pill buttons right.
 */
export function Header() {
  return (
    <header className="w-full bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-6 px-8 py-5">
        <Logo />

        <nav className="flex items-center gap-7">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="inline-flex items-center gap-1 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
            >
              {item.label}
              {item.chevron && (
                <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" size="sm">
            Login
          </Button>
          <Button size="sm">Register</Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
