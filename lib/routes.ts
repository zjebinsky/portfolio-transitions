export interface Route {
  label: string;
  path: string;
}

export const primaryRoutes: Route[] = [
  { label: "Index", path: "/" },
  { label: "Information", path: "/information" },
  { label: "Contact", path: "/contact" },
];

export const secondaryRoutes: Route[] = [
  { label: "Glossary", path: "/glossary" },
  { label: "Playground", path: "/playground" },
  { label: "FAQs", path: "/faqs" },
  { label: "Privacy Policy", path: "/privacy-policy" },
  { label: "Terms of Service", path: "/terms-of-service" },
  { label: "Cookie Settings", path: "/cookie-settings" },
];

export const allRoutes: Route[] = [...primaryRoutes, ...secondaryRoutes];
