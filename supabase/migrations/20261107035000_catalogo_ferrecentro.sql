create table public.productos (
  id bigint generated always as identity primary key,
  categoria text not null check (categoria in ('herramienta', 'combo')),
  nombre text not null check (length(trim(nombre)) > 0),
  descripcion text not null default '',
  precio_pen numeric(10,2) check (precio_pen >= 0),
  imagen_url text check (imagen_url ~ '^https://'),
  publicado boolean not null default false,
  orden integer not null default 0
);

create table public.testimonios (
  id bigint generated always as identity primary key,
  modalidad text not null check (modalidad in ('lima', 'shalom')),
  autor text,
  comentario text not null check (length(trim(comentario)) > 0),
  imagen_url text check (imagen_url ~ '^https://'),
  publicado boolean not null default false,
  orden integer not null default 0
);

alter table public.productos enable row level security;
alter table public.testimonios enable row level security;
revoke all on public.productos, public.testimonios from anon, authenticated;
grant select on public.productos, public.testimonios to anon, authenticated;
create policy "Lectura de productos publicados" on public.productos
  for select to anon, authenticated using (publicado);
create policy "Lectura de testimonios publicados" on public.testimonios
  for select to anon, authenticated using (publicado);
