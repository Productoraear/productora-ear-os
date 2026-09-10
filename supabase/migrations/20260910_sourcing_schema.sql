-- EAR OS V2.4 // Sourcing & Tesorería Schema
-- Ejecutar en Supabase SQL Editor

-- 1. Tabla de Presupuestos (Sourcing Budgets)
CREATE TABLE IF NOT EXISTS sourcing_budgets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    target_budget NUMERIC NOT NULL DEFAULT 0,
    current_spend NUMERIC NOT NULL DEFAULT 0,
    total_guests INTEGER NOT NULL DEFAULT 0,
    status TEXT CHECK (status IN ('draft', 'approved', 'locked')) DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de Proveedores Activos (Sourcing Suppliers)
CREATE TABLE IF NOT EXISTS sourcing_suppliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    stage TEXT CHECK (stage IN ('prospect', 'negotiation', 'contracted', 'paid')) DEFAULT 'prospect',
    lead_source TEXT,
    projected_cost NUMERIC NOT NULL DEFAULT 0,
    paid_amount NUMERIC NOT NULL DEFAULT 0,
    contact_email TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de Checklist de Producción
CREATE TABLE IF NOT EXISTS sourcing_checklist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    task_name TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
    due_date DATE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE sourcing_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sourcing_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sourcing_checklist ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS ESTRICTAS S-CLASS (Solo usuarios autenticados pueden operar)
CREATE POLICY "Admin All Access Budgets" ON sourcing_budgets FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Access Suppliers" ON sourcing_suppliers FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Access Checklist" ON sourcing_checklist FOR ALL TO authenticated USING (true);
