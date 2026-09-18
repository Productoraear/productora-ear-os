import { Metadata } from "next";
import { SClassProEmpMenu } from "@/components/fincas/sclass-pro/SClassProEmpMenu";

export const metadata: Metadata = {
  title: "Panel de Empresas B2B • S-Class Pro | Productora EAR",
  description: "Acceso soberano al panel de gestión B2B para proveedores y fincas homologadas.",
  alternates: {
    canonical: "https://productoraear.com/emp-menu",
  },
};

export default function EmpMenuPage() {
  return <SClassProEmpMenu />;
}
