import React from 'react';

import { FC, PropsWithChildren } from 'react';

interface ProveedorDirectoryProps extends PropsWithChildren {
    initialCategory?: string;
}

const ProveedorDirectory: FC<ProveedorDirectoryProps> = ({ initialCategory }) => {
    return (
        <div className="bg-black p-10 rounded-[2.5rem] border border-white/5 hover:border-white/20 transition-all duration-500 shadow-2xl">
            <h3 className="text-white font-display font-black text-xl mb-4 italic uppercase">Proveedor Directory</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-light">
Este es un directorio de proveedores de servicios para eventos. Inicial categoría: {initialCategory}
            </p>
        </div>
    );
};

export default ProveedorDirectory;
