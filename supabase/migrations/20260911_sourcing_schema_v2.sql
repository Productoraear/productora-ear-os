-- ============================================================================
-- EAR OS V2.4 // MIGRACIÓN CONSOLIDADA SSOT v2 — CABINA SOURCING
-- Resuelve el conflicto entre 20260909_sourcing_schema.sql y 20260910_sourcing_schema.sql.
-- Idempotente: CREATE TABLE IF NOT EXISTS + ADD COLUMN IF NOT EXISTS + limpieza
-- de CHECK constraints restrictivos de stage/status para habilitar el Kanban de 6 etapas.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SOURCING_BUDGETS — Control de caja real, desviaciones y tesorería
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sourcing_budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID,
    category TEXT NOT NULL,
    item_name TEXT NOT NULL,
    target_budget NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    estimated_cost NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    actual_cost NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    paid_amount NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    pending_amount NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    total_guests INTEGER NOT NULL DEFAULT 0,
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
    status TEXT NOT NULL DEFAULT 'draft',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE sourcing_budgets ADD COLUMN IF NOT EXISTS event_id UUID;
ALTER TABLE sourcing_budgets ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE sourcing_budgets ADD COLUMN IF NOT EXISTS item_name TEXT;
ALTER TABLE sourcing_budgets ADD COLUMN IF NOT EXISTS target_budget NUMERIC(14,2) DEFAULT 0.00;
ALTER TABLE sourcing_budgets ADD COLUMN IF NOT EXISTS estimated_cost NUMERIC(14,2) DEFAULT 0.00;
ALTER TABLE sourcing_budgets ADD COLUMN IF NOT EXISTS actual_cost NUMERIC(14,2) DEFAULT 0.00;
ALTER TABLE sourcing_budgets ADD COLUMN IF NOT EXISTS paid_amount NUMERIC(14,2) DEFAULT 0.00;
ALTER TABLE sourcing_budgets ADD COLUMN IF NOT EXISTS pending_amount NUMERIC(14,2) DEFAULT 0.00;
ALTER TABLE sourcing_budgets ADD COLUMN IF NOT EXISTS total_guests INTEGER DEFAULT 0;
ALTER TABLE sourcing_budgets ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'EUR';
ALTER TABLE sourcing_budgets ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';
ALTER TABLE sourcing_budgets ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE sourcing_budgets ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ----------------------------------------------------------------------------
-- 2. SOURCING_SUPPLIERS — Pipeline Kanban de 6 etapas sin intermediarios
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sourcing_suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    stage TEXT NOT NULL DEFAULT 'identified',
    rating INTEGER NOT NULL DEFAULT 5,
    lead_source TEXT,
    contact_email TEXT,
    phone_number TEXT,
    quoted_price NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    projected_cost NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    paid_amount NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE sourcing_suppliers ADD COLUMN IF NOT EXISTS event_id UUID;
ALTER TABLE sourcing_suppliers ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE sourcing_suppliers ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE sourcing_suppliers ADD COLUMN IF NOT EXISTS stage TEXT DEFAULT 'identified';
ALTER TABLE sourcing_suppliers ADD COLUMN IF NOT EXISTS rating INTEGER DEFAULT 5;
ALTER TABLE sourcing_suppliers ADD COLUMN IF NOT EXISTS lead_source TEXT;
ALTER TABLE sourcing_suppliers ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE sourcing_suppliers ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE sourcing_suppliers ADD COLUMN IF NOT EXISTS quoted_price NUMERIC(14,2) DEFAULT 0.00;
ALTER TABLE sourcing_suppliers ADD COLUMN IF NOT EXISTS projected_cost NUMERIC(14,2) DEFAULT 0.00;
ALTER TABLE sourcing_suppliers ADD COLUMN IF NOT EXISTS paid_amount NUMERIC(14,2) DEFAULT 0.00;
ALTER TABLE sourcing_suppliers ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
ALTER TABLE sourcing_suppliers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ----------------------------------------------------------------------------
-- 3. SOURCING_CHECKLIST — Puertas de producción institucionales con dependencias
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sourcing_checklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID,
    task_name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    status TEXT NOT NULL DEFAULT 'pending',
    priority TEXT NOT NULL DEFAULT 'medium',
    assigned_to TEXT,
    depends_on UUID,
    deadline DATE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE sourcing_checklist ADD COLUMN IF NOT EXISTS event_id UUID;
ALTER TABLE sourcing_checklist ADD COLUMN IF NOT EXISTS task_name TEXT;
ALTER TABLE sourcing_checklist ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';
ALTER TABLE sourcing_checklist ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE sourcing_checklist ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium';
ALTER TABLE sourcing_checklist ADD COLUMN IF NOT EXISTS assigned_to TEXT;
ALTER TABLE sourcing_checklist ADD COLUMN IF NOT EXISTS depends_on UUID;
ALTER TABLE sourcing_checklist ADD COLUMN IF NOT EXISTS deadline DATE;
ALTER TABLE sourcing_checklist ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
ALTER TABLE sourcing_checklist ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ----------------------------------------------------------------------------
-- 4. LIMPIEZA DE CHECK CONSTRAINTS RESTRICTIVOS (habilita 6 etapas + 3 estados)
-- ----------------------------------------------------------------------------
DO $$
DECLARE
    c record;
BEGIN
    FOR c IN
        SELECT conname, conrelid::regclass AS tbl
        FROM pg_constraint
        WHERE contype = 'c'
          AND conrelid::regclass::text IN ('sourcing_suppliers','sourcing_checklist','sourcing_budgets')
          AND pg_get_constraintdef(oid) ILIKE '%stage%'
    LOOP
        EXECUTE format('ALTER TABLE %s DROP CONSTRAINT IF EXISTS %s', c.tbl, c.conname);
    END LOOP;

    FOR c IN
        SELECT conname, conrelid::regclass AS tbl
        FROM pg_constraint
        WHERE contype = 'c'
          AND conrelid::regclass::text IN ('sourcing_suppliers','sourcing_checklist','sourcing_budgets')
          AND pg_get_constraintdef(oid) ILIKE '%status%'
    LOOP
        EXECUTE format('ALTER TABLE %s DROP CONSTRAINT IF EXISTS %s', c.tbl, c.conname);
    END LOOP;
END $$;

-- ----------------------------------------------------------------------------
-- 5. ÍNDICES DE RENDIMIENTO
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_sourcing_budgets_event ON sourcing_budgets(event_id);
CREATE INDEX IF NOT EXISTS idx_sourcing_budgets_category ON sourcing_budgets(category);
CREATE INDEX IF NOT EXISTS idx_sourcing_suppliers_event ON sourcing_suppliers(event_id);
CREATE INDEX IF NOT EXISTS idx_sourcing_suppliers_stage ON sourcing_suppliers(stage);
CREATE INDEX IF NOT EXISTS idx_sourcing_suppliers_category ON sourcing_suppliers(category);
CREATE INDEX IF NOT EXISTS idx_sourcing_checklist_event ON sourcing_checklist(event_id);
CREATE INDEX IF NOT EXISTS idx_sourcing_checklist_status ON sourcing_checklist(status);

-- ----------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY + POLÍTICAS ESTRICTAS S-CLASS
-- ----------------------------------------------------------------------------
ALTER TABLE sourcing_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sourcing_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sourcing_checklist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin All Access Budgets" ON sourcing_budgets;
DROP POLICY IF EXISTS "Admin All Access Suppliers" ON sourcing_suppliers;
DROP POLICY IF EXISTS "Admin All Access Checklist" ON sourcing_checklist;

CREATE POLICY "Admin All Access Budgets" ON sourcing_budgets FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Access Suppliers" ON sourcing_suppliers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Access Checklist" ON sourcing_checklist FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 7. TRIGGER DE updated_at AUTOMÁTICO
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trg_set_updated_at() RETURNS trigger AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sourcing_budgets_updated ON sourcing_budgets;
CREATE TRIGGER trg_sourcing_budgets_updated BEFORE UPDATE ON sourcing_budgets
FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

DROP TRIGGER IF EXISTS trg_sourcing_suppliers_updated ON sourcing_suppliers;
CREATE TRIGGER trg_sourcing_suppliers_updated BEFORE UPDATE ON sourcing_suppliers
FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

DROP TRIGGER IF EXISTS trg_sourcing_checklist_updated ON sourcing_checklist;
CREATE TRIGGER trg_sourcing_checklist_updated BEFORE UPDATE ON sourcing_checklist
FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();