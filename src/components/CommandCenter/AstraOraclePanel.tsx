/**
 * Re-export canónico del AstraOraclePanel.
 * El panel real vive en src/app/components/SClass/AstraOraclePanel.tsx
 * Este alias evita rutas duplicadas en el codebase.
 *
 * A11Y (W07-044): El componente real ya expone roles ARIA, aria-labels y
 * alt texts en sus elementos interactivos. Este alias preserva el contrato
 * público y re-exporta tanto el default como los tipos asociados para
 * mantener la superficie tipada estable.
 *
 * NOTA (TS2614): El módulo fuente no exporta `AstraOraclePanelProps` como
 * named export. Se declara aquí un tipo estructural compatible para
 * preservar la superficie pública tipada sin romper consumidores.
 */
import type { ComponentProps } from "react";
import AstraOraclePanel from "@/app/components/SClass/AstraOraclePanel";

export type AstraOraclePanelProps = ComponentProps<typeof AstraOraclePanel>;

export default AstraOraclePanel;