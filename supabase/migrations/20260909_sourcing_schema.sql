-- supabase/migrations/20260909_sourcing_schema.sql
-- ESQUEMA S-CLASS DE CONTROL FINANCIERO Y SOURCING EAR OS

CREATE TABLE IF NOT EXISTS sourcing_budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID,
    category TEXT NOT NULL,
    item_name TEXT NOT NULL,
    estimated_cost NUMERIC(12,2) DEFAULT 0.00,
    actual_cost NUMERIC(12,2) DEFAULT 0.00,
    paid_amount NUMERIC(12,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'EUR',
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sourcing_suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    stage TEXT CHECK (stage IN ('identified', 'contacted', 'shortlisted', 'approved', 'rejected')) DEFAULT 'identified',
    rating INT DEFAULT 5,
    contact_email TEXT,
    phone_number TEXT,
    quoted_price NUMERIC(12,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sourcing_checklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID,
    task_name TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
    deadline DATE,
    priority TEXT DEFAULT 'medium',
    assigned_to TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
