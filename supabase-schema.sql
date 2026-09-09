-- ==============================================================================
-- Script SQL para Supabase — AzurraERP Lead Capture (Feira FRESQUA 2026)
-- Execute este script no SQL Editor do seu projeto Supabase (Dashboard -> SQL Editor)
-- ==============================================================================

-- 1. Criar a tabela de leads
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    role TEXT,
    whatsapp TEXT NOT NULL,
    email TEXT,
    segment TEXT,
    segment_label TEXT,
    revenue TEXT,
    revenue_label TEXT,
    pains JSONB DEFAULT '[]'::jsonb,
    current_system TEXT,
    urgency TEXT,
    score INTEGER DEFAULT 50,
    status TEXT DEFAULT 'warm',
    estimated_monthly_loss TEXT,
    estimated_monthly_hours TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 3. Permitir inserção anônima (para os formulários do stand e celulares dos visitantes via chave anon)
DROP POLICY IF EXISTS "Permitir inserção de leads" ON public.leads;
CREATE POLICY "Permitir inserção de leads"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 4. Permitir leitura dos leads (para exibição no painel administrativo do stand)
DROP POLICY IF EXISTS "Permitir leitura de leads" ON public.leads;
CREATE POLICY "Permitir leitura de leads"
ON public.leads
FOR SELECT
TO anon, authenticated
USING (true);

-- 5. Permitir atualização e deleção de leads (para sincronização e gerenciamento)
DROP POLICY IF EXISTS "Permitir atualização de leads" ON public.leads;
CREATE POLICY "Permitir atualização de leads"
ON public.leads
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir deleção de leads" ON public.leads;
CREATE POLICY "Permitir deleção de leads"
ON public.leads
FOR DELETE
TO anon, authenticated
USING (true);

-- 6. Criar índices para busca rápida e ordenação
CREATE INDEX IF NOT EXISTS idx_leads_timestamp ON public.leads (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_whatsapp ON public.leads (whatsapp);

-- 7. Tabela opcional para sincronização de configurações de tela entre múltiplos computadores
CREATE TABLE IF NOT EXISTS public.app_config (
    id TEXT PRIMARY KEY,
    config JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir leitura e escrita de config" ON public.app_config;
CREATE POLICY "Permitir leitura e escrita de config"
ON public.app_config
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

