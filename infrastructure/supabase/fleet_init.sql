-- 🏛️ EAR OS / SUPABASE POSTGIS INITIALIZATION
-- Run this in the Supabase SQL Editor

-- 1. Enable Extensions
create extension if not exists postgis;
create extension if not exists pgrouting;

-- 2. Add Geography Columns to Fleet Tables
-- Prisma doesn't natively support PostGIS 'geography' type in the schema file yet, 
-- so we handle it with a migration/SQL script.

alter table fleet_waybills
  add column if not exists origin_point geography(Point, 4326),
  add column if not exists destination_point geography(Point, 4326);

alter table fleet_telemetry_events
  add column if not exists position geography(Point, 4326);

-- 3. Synchronize existing lat/lng to geography points
update fleet_waybills
set
  origin_point = ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography,
  destination_point = ST_SetSRID(ST_MakePoint(destination_lng, destination_lat), 4326)::geography
where origin_point is null or destination_point is null;

update fleet_telemetry_events
set position = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
where position is null;

-- 4. Create GIST Indices for Spatial Performance
create index if not exists idx_waybills_origin_point
  on fleet_waybills using gist (origin_point);

create index if not exists idx_waybills_destination_point
  on fleet_waybills using gist (destination_point);

create index if not exists idx_telemetry_position
  on fleet_telemetry_events using gist (position);

-- 5. RPC: nearby_available_units
-- Finds units within a radius, ordered by distance.
create or replace function nearby_available_units(
  p_workspace_id uuid,
  p_lng double precision,
  p_lat double precision,
  p_radius_meters integer default 5000
)
returns table (
  unit_id uuid,
  code text,
  distance_meters double precision
)
language sql
as $$
  select
    fu.id as unit_id,
    fu.code,
    ST_Distance(
      ST_SetSRID(ST_MakePoint(fu.last_longitude, fu.last_latitude), 4326)::geography,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography
    ) as distance_meters
  from fleet_units fu
  where fu.workspace_id = p_workspace_id
    and fu.last_latitude is not null
    and fu.last_longitude is not null
    and ST_DWithin(
      ST_SetSRID(ST_MakePoint(fu.last_longitude, fu.last_latitude), 4326)::geography,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
      p_radius_meters
    )
  order by distance_meters asc;
$$;

-- 6. RPC: assign_unit_to_waybill
-- Atomic unit assignment with status update.
create or replace function assign_unit_to_waybill(
  p_waybill_id uuid,
  p_unit_id uuid
)
returns void
language plpgsql
as $$
begin
  -- Update waybill
  update fleet_waybills
  set unit_id = p_unit_id, status = 'DISPATCHED'
  where id = p_waybill_id;

  -- Update unit status
  update fleet_units
  set status = 'BUSY'
  where id = p_unit_id;
end;
$$;
