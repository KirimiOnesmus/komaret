import {
  FaBuilding,
  FaTruckMoving,
  FaUsers,
  FaCouch,
  FaPaintRoller,
  FaCity,
  FaComments,
  FaTools,
} from "react-icons/fa";

/**
 * Category icons live in the frontend only (never the DB/API). Each fixed,
 * seeded category is matched to an icon here by its slug. Using react-icons
 * keeps the set consistent, brand-gold (they inherit currentColor), and tiny —
 * matching the mockup's icon style.
 *
 * To swap in a custom SVG for a category later, replace its entry with a small
 * component that renders the SVG (using currentColor so it still tints gold).
 */
const CATEGORY_ICONS = {
  "general-construction": FaBuilding,
  "machinery-hire": FaTruckMoving,
  "labour-supply": FaUsers,
  "interior-design": FaCouch,
  renovation: FaPaintRoller,
  "real-estate-development": FaCity,
  consultation: FaComments,
  other: FaTools,
};

const FALLBACK_ICON = FaBuilding;

export function getCategoryIcon(slug) {
  return CATEGORY_ICONS[slug] || FALLBACK_ICON;
}

export default CATEGORY_ICONS;
