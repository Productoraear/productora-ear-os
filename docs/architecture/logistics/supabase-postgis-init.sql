-- EAR OS — SUPABASE POSTGIS & LOGISTICS INITIALIZATION
-- Run this in your Supabase SQL Editor to enable geographical intelligence.

create extension if not exists postgis;
create extension if not exists pgrouting;

-- Add geography columns for spatial indexing (optimized sorting by distance)
alter table fleet_waybills
  add column if not exists origin_point geography(Point, 4326),
  add column if not exists destination_point geography(Point, 4326);

alter table fleet_telemetry_events
  add column if not exists position geography(Point, 4326);

-- Populate geography columns from numeric lat/lng
update fleet_waybills
set
  origin_point = ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography,
  destination_point = ST_SetSRID(ST_MakePoint(destination_lng, destination_lat), 4326)::geography
where origin_point is null or destination_point is null;

update fleet_telemetry_events
set position = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
where position is null;

-- GIST Indexes for performance
create index if not exists idx_waybills_origin_point
  on fleet_waybills using gist (origin_point);

create index if not exists idx_waybills_destination_point
  on fleet_waybills using gist (destination_point);

create index if not exists idx_telemetry_position
  on fleet_telemetry_events using gist (position);

-- Real-time Function: Nearby Available Units
-- Find units within a radius sorted by distance
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
