-- ==========================================================
-- AzurraERP Lead Capture - T-SQL Schema para Microsoft SQL Server
-- Feira FRESQUA 2026
-- ==========================================================

-- 1. Criação da base de dados (se necessário, descomente):
-- CREATE DATABASE azurra_leads;
-- GO
-- USE azurra_leads;
-- GO

-- 2. Criação da Tabela de Leads
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[leads]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[leads] (
        [id] VARCHAR(50) NOT NULL PRIMARY KEY,
        [timestamp] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
        [name] NVARCHAR(150) NULL,
        [company] NVARCHAR(150) NULL,
        [role] NVARCHAR(100) NULL,
        [whatsapp] VARCHAR(30) NULL,
        [email] NVARCHAR(150) NULL,
        [segment] VARCHAR(50) NULL,
        [segmentLabel] NVARCHAR(100) NULL,
        [revenue] VARCHAR(50) NULL,
        [revenueLabel] NVARCHAR(100) NULL,
        [pains] NVARCHAR(MAX) NULL, -- Armazena array JSON de dores: ["estoque", "fiscal", ...]
        [currentSystem] VARCHAR(50) NULL,
        [urgency] VARCHAR(50) NULL,
        [score] INT NULL,
        [status] VARCHAR(20) NULL, -- 'hot', 'warm', 'cold'
        [estimatedMonthlyLoss] NVARCHAR(50) NULL,
        [estimatedMonthlyHours] NVARCHAR(50) NULL,
        [notes] NVARCHAR(MAX) NULL, -- Observações/detalhes adicionais inseridos pelo cliente
        [created_at] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
        [updated_at] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
    );

    -- Índices para buscas rápidas no painel do stand
    CREATE NONCLUSTERED INDEX [IX_leads_status] ON [dbo].[leads] ([status]);
    CREATE NONCLUSTERED INDEX [IX_leads_timestamp] ON [dbo].[leads] ([timestamp] DESC);
    CREATE NONCLUSTERED INDEX [IX_leads_score] ON [dbo].[leads] ([score] DESC);

    PRINT 'Tabela [dbo].[leads] criada com sucesso no SQL Server!';
END
ELSE
BEGIN
    PRINT 'A tabela [dbo].[leads] já existe.';
END
GO
