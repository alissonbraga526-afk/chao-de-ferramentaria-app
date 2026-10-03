-- V6: liberar novos tipos na tabela conteudos
alter table public.conteudos
drop constraint if exists conteudos_tipo_check;

alter table public.conteudos
add constraint conteudos_tipo_check
check (tipo in ('tecnico','eventos','episodios','parceiros','empresas','vagas'));
