# Task: Analyze bodas.net vendor selection page

## Plan
- [x] Open bodas.net
- [x] Navigate to "Proveedores" (Vendors) section
- [x] Identify UI components (atoms)
    - Buttons: Primary red "Buscar", blue/red "Solicitar Presupuesto", toggle switches, view mode selectors.
    - Cards: Vendor cards with image carousel, title, rating, location, snippet, price, and CTA.
    - Search bars: Dual input for category/name and location.
    - Category icons: (Seen on main providers page) Icon + text in a grid or carousel.
- [x] Take screenshots
- [x] Note down observations

## Observations
### UI Atoms Identified (Provider Selection Interface)
1.  **Dual Search Bar**: Splitted into "What" (Name/Category) and "Where" (Location) with a persistent search icon and a prominent CTA button.
2.  **Filter Sidebar**:
    - Sticky or scrollable sidebar with collapsible headers.
    - Toggle switches for binary filters (Deals, Awards).
    - Checkbox groups for multi-select (Price ranges, Services).
3.  **View Switcher**: Segmented control / Tabs for switching between List, Gallery/Images, and Map views.
4.  **Vendor Card (The Molecule)**:
    - Image slider/carousel with pagination dots and a "Heart" (Favorite) icon overlay.
    - Header: Vendor name (link) + Rating (Star + count) + Location.
    - Description: Short text snippet.
    - Price: "Desde [Amount]" label.
    - CTA: "Solicitar Presupuesto" (primary red button).
    - Status Badge: "Responde en 24 horas" with a lightning bolt icon.
5.  **Breadcrumbs**: Simple text path for navigation context.

### Design Patterns
- High use of white space and clean typography.
- Primary color: Crimson/Red (#d14d5d) for CTAs.
- Secondary color: Blue for links and ratings.
- Soft shadows on cards and inputs.
- Rounded corners on almost all elements (inputs, buttons, cards).
