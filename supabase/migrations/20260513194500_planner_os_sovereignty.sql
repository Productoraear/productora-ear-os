-- 🏛️ EAR OS - PLANNER OS SOVEREIGNTY MIGRATION (V158.6)
-- --------------------------------------------------------

-- A. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- B. FUNCIÓN TRIGGER
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- C. TABLAS

-- 1. workspaces
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- 2. memberships
CREATE TABLE IF NOT EXISTS memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner','admin','editor','viewer')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','pending','suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (workspace_id, user_id)
);

-- 3. events
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  venue_name TEXT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- 4. tables
CREATE TABLE IF NOT EXISTS tables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- 5. guests
CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  table_id UUID NULL REFERENCES tables(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NULL,
  phone TEXT NULL,
  status TEXT NOT NULL DEFAULT 'invited' CHECK (status IN ('invited','confirmed','declined','checked-in')),
  seat_label TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- D. ÍNDICES OBLIGATORIOS
CREATE INDEX IF NOT EXISTS idx_workspaces_slug ON workspaces(slug);
CREATE INDEX IF NOT EXISTS idx_memberships_user_workspace_status ON memberships(user_id, workspace_id, status);
CREATE INDEX IF NOT EXISTS idx_memberships_workspace_status ON memberships(workspace_id, status);
CREATE INDEX IF NOT EXISTS idx_events_workspace_id ON events(workspace_id);
CREATE INDEX IF NOT EXISTS idx_events_workspace_date ON events(workspace_id, event_date);
CREATE INDEX IF NOT EXISTS idx_tables_workspace_event ON tables(workspace_id, event_id);
CREATE INDEX IF NOT EXISTS idx_guests_workspace_event ON guests(workspace_id, event_id);
CREATE INDEX IF NOT EXISTS idx_guests_table_id ON guests(table_id);

-- E. TRIGGERS OBLIGATORIOS
CREATE TRIGGER tr_workspaces_updated_at BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER tr_memberships_updated_at BEFORE UPDATE ON memberships FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER tr_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER tr_tables_updated_at BEFORE UPDATE ON tables FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER tr_guests_updated_at BEFORE UPDATE ON guests FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- F. RLS OBLIGATORIO
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- G. POLÍTICAS OBLIGATORIAS

-- 1. memberships
CREATE POLICY "memberships_select_own" ON memberships FOR SELECT 
USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "memberships_insert_admin" ON memberships FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM memberships m 
    WHERE m.workspace_id = memberships.workspace_id 
    AND m.user_id = auth.uid() 
    AND m.status = 'active' 
    AND m.role IN ('owner', 'admin')
  )
);

CREATE POLICY "memberships_update_admin" ON memberships FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM memberships m 
    WHERE m.workspace_id = memberships.workspace_id 
    AND m.user_id = auth.uid() 
    AND m.status = 'active' 
    AND m.role IN ('owner', 'admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM memberships m 
    WHERE m.workspace_id = memberships.workspace_id 
    AND m.user_id = auth.uid() 
    AND m.status = 'active' 
    AND m.role IN ('owner', 'admin')
  )
);

CREATE POLICY "memberships_delete_admin" ON memberships FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM memberships m 
    WHERE m.workspace_id = memberships.workspace_id 
    AND m.user_id = auth.uid() 
    AND m.status = 'active' 
    AND m.role IN ('owner', 'admin')
  )
);

-- 2. workspaces
CREATE POLICY "workspaces_select_member" ON workspaces FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM memberships m 
    WHERE m.workspace_id = workspaces.id 
    AND m.user_id = auth.uid() 
    AND m.status = 'active'
  ) AND deleted_at IS NULL
);

CREATE POLICY "workspaces_insert_owner" ON workspaces FOR INSERT
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "workspaces_update_admin" ON workspaces FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM memberships m 
    WHERE m.workspace_id = workspaces.id 
    AND m.user_id = auth.uid() 
    AND m.status = 'active' 
    AND m.role IN ('owner', 'admin')
  ) AND deleted_at IS NULL
);

CREATE POLICY "workspaces_delete_owner" ON workspaces FOR DELETE
USING (owner_id = auth.uid());

-- 3. events
CREATE POLICY "events_select_member" ON events FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM memberships m 
    WHERE m.workspace_id = events.workspace_id 
    AND m.user_id = auth.uid() 
    AND m.status = 'active'
  ) AND deleted_at IS NULL
);

CREATE POLICY "events_insert_editor" ON events FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM memberships m 
    WHERE m.workspace_id = events.workspace_id 
    AND m.user_id = auth.uid() 
    AND m.status = 'active' 
    AND m.role IN ('owner', 'admin', 'editor')
  ) AND created_by = auth.uid()
);

CREATE POLICY "events_update_editor" ON events FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM memberships m 
    WHERE m.workspace_id = events.workspace_id 
    AND m.user_id = auth.uid() 
    AND m.status = 'active' 
    AND m.role IN ('owner', 'admin', 'editor')
  ) AND deleted_at IS NULL
);

CREATE POLICY "events_delete_admin" ON events FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM memberships m 
    WHERE m.workspace_id = events.workspace_id 
    AND m.user_id = auth.uid() 
    AND m.status = 'active' 
    AND m.role IN ('owner', 'admin')
  )
);

-- 4. tables
CREATE POLICY "tables_select_member" ON tables FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM memberships m 
    WHERE m.workspace_id = tables.workspace_id 
    AND m.user_id = auth.uid() 
    AND m.status = 'active'
  ) AND deleted_at IS NULL
);

CREATE POLICY "tables_insert_editor" ON tables FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM memberships m 
    WHERE m.workspace_id = tables.workspace_id 
    AND m.user_id = auth.uid() 
    AND m.status = 'active' 
    AND m.role IN ('owner', 'admin', 'editor')
  )
);

CREATE POLICY "tables_update_editor" ON tables FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM memberships m 
    WHERE m.workspace_id = tables.workspace_id 
    AND m.user_id = auth.uid() 
    AND m.status = 'active' 
    AND m.role IN ('owner', 'admin', 'editor')
  ) AND deleted_at IS NULL
);

CREATE POLICY "tables_delete_admin" ON tables FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM memberships m 
    WHERE m.workspace_id = tables.workspace_id 
    AND m.user_id = auth.uid() 
    AND m.status = 'active' 
    AND m.role IN ('owner', 'admin')
  )
);

-- 5. guests
CREATE POLICY "guests_select_member" ON guests FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM memberships m 
    WHERE m.workspace_id = guests.workspace_id 
    AND m.user_id = auth.uid() 
    AND m.status = 'active'
  ) AND deleted_at IS NULL
);

CREATE POLICY "guests_insert_editor" ON guests FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM memberships m 
    WHERE m.workspace_id = guests.workspace_id 
    AND m.user_id = auth.uid() 
    AND m.status = 'active' 
    AND m.role IN ('owner', 'admin', 'editor')
  )
);

CREATE POLICY "guests_update_editor" ON guests FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM memberships m 
    WHERE m.workspace_id = guests.workspace_id 
    AND m.user_id = auth.uid() 
    AND m.status = 'active' 
    AND m.role IN ('owner', 'admin', 'editor')
  ) AND deleted_at IS NULL
);

CREATE POLICY "guests_delete_admin" ON guests FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM memberships m 
    WHERE m.workspace_id = guests.workspace_id 
    AND m.user_id = auth.uid() 
    AND m.status = 'active' 
    AND m.role IN ('owner', 'admin')
  )
);
