-- Migration: add category column to skills
-- Run this in Supabase SQL Editor after the initial schema.sql

alter table public.skills
  add column if not exists category text not null default 'other'
  check (category in (
    'writing','code','data','creative','research','business','education','other'
  ));

create index if not exists skills_category_idx on public.skills(category);
