-- Execute no SQL Editor do Supabase
create extension if not exists pgcrypto;

create table if not exists public.conteudos (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('tecnico','eventos','episodios','parceiros')),
  titulo text not null,
  descricao text not null,
  link text,
  data_evento date,
  created_at timestamptz not null default now()
);

alter table public.conteudos enable row level security;

create policy "leitura publica"
on public.conteudos for select
using (true);

-- PRIMEIRA VERSÃO SIMPLES:
-- permite inserir e excluir usando a anon key.
-- Depois recomendo trocar por login real.
create policy "insercao publica temporaria"
on public.conteudos for insert
with check (true);

create policy "exclusao publica temporaria"
on public.conteudos for delete
using (true);
