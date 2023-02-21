import { pages, usePage } from "../hooks/usePage";

export const NavLinks = () => {
  const [currentPage] = usePage();
  return (
    <nav>
      <ul className="nav-list">
        {pages.map((page) => (
          <li key={page}>
            <a
              href={`#${page}`}
              className={`nav-link nav-link--${
                page === currentPage ? "current" : ""
              }`}
            >
              {page}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
