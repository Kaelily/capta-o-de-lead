/**
 * AzurraERP Lead Capture - Backend API para Microsoft SQL Server
 * Feira FRESQUA 2026
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sql from 'mssql';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Servir arquivos estáticos do front-end (index.html, admin.html, css, js)
app.use(express.static(__dirname));

// Configuração da conexão com o Microsoft SQL Server
const sqlConfig = {
  server: process.env.DB_SERVER || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  database: process.env.DB_DATABASE || 'azurra_leads',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERT !== 'false',
    enableArithAbort: true,
    connectTimeout: 8000,
    requestTimeout: 15000
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let poolPromise = null;

async function ensureTableExists(pool) {
  try {
    await pool.request().query(`
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
              [pains] NVARCHAR(MAX) NULL,
              [currentSystem] VARCHAR(50) NULL,
              [urgency] VARCHAR(50) NULL,
              [score] INT NULL,
              [status] VARCHAR(20) NULL,
              [estimatedMonthlyLoss] NVARCHAR(50) NULL,
              [estimatedMonthlyHours] NVARCHAR(50) NULL,
              [notes] NVARCHAR(MAX) NULL,
              [created_at] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
              [updated_at] DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
          );
      END;

      IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[leads]') AND name = 'notes')
      BEGIN
          ALTER TABLE [dbo].[leads] ADD [notes] NVARCHAR(MAX) NULL;
      END;
    `);
  } catch (err) {
    console.error('Aviso: Não foi possível verificar/criar tabela automática no SQL Server:', err.message);
  }
}

async function getPool() {
  if (!poolPromise) {
    poolPromise = sql.connect(sqlConfig).then(async (pool) => {
      await ensureTableExists(pool);
      return pool;
    }).catch(err => {
      poolPromise = null;
      throw err;
    });
  }
  return poolPromise;
}

// ----------------------------------------------------
// ROTAS DA API
// ----------------------------------------------------

/**
 * GET /api/health
 * Verifica o status da conexão com o SQL Server
 */
app.get('/api/health', async (req, res) => {
  try {
    const pool = await getPool();
    await pool.request().query('SELECT 1 AS ping');
    return res.json({
      status: 'ok',
      database: 'Microsoft SQL Server',
      connected: true,
      server: sqlConfig.server,
      databaseName: sqlConfig.database
    });
  } catch (error) {
    return res.status(503).json({
      status: 'error',
      database: 'Microsoft SQL Server',
      connected: false,
      message: error.message || 'Não foi possível conectar ao SQL Server.',
      hint: 'Verifique se o serviço do SQL Server está rodando e as credenciais no .env estão corretas.'
    });
  }
});

/**
 * GET /api/leads
 * Retorna todos os leads cadastrados
 */
app.get('/api/leads', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT 
        [id],
        [timestamp],
        [name],
        [company],
        [role],
        [whatsapp],
        [email],
        [segment],
        [segmentLabel],
        [revenue],
        [revenueLabel],
        [pains],
        [currentSystem],
        [urgency],
        [score],
        [status],
        [estimatedMonthlyLoss],
        [estimatedMonthlyHours],
        [notes]
      FROM [dbo].[leads]
      ORDER BY [timestamp] DESC
    `);

    // Faz o parse do campo dores (pains) que é salvo como JSON string
    const formattedLeads = result.recordset.map(row => {
      let parsedPains = [];
      if (row.pains) {
        try {
          parsedPains = JSON.parse(row.pains);
        } catch {
          parsedPains = [row.pains];
        }
      }
      return {
        ...row,
        pains: parsedPains,
        timestamp: row.timestamp ? new Date(row.timestamp).toISOString() : new Date().toISOString()
      };
    });

    return res.json({ success: true, leads: formattedLeads });
  } catch (error) {
    console.error('Erro ao buscar leads no SQL Server:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Erro ao consultar leads no SQL Server.'
    });
  }
});

/**
 * POST /api/leads
 * Insere ou atualiza (UPSERT) um lead no SQL Server
 */
app.post('/api/leads', async (req, res) => {
  const lead = req.body;
  if (!lead || !lead.id) {
    return res.status(400).json({ success: false, message: 'Dados do lead inválidos ou ID ausente.' });
  }

  try {
    const pool = await getPool();
    const request = pool.request();

    const painsStr = Array.isArray(lead.pains) ? JSON.stringify(lead.pains) : (lead.pains || '[]');
    const leadTimestamp = lead.timestamp ? new Date(lead.timestamp) : new Date();

    request.input('id', sql.VarChar(50), lead.id);
    request.input('timestamp', sql.DateTimeOffset, leadTimestamp);
    request.input('name', sql.NVarChar(150), lead.name || null);
    request.input('company', sql.NVarChar(150), lead.company || null);
    request.input('role', sql.NVarChar(100), lead.role || null);
    request.input('whatsapp', sql.VarChar(30), lead.whatsapp || null);
    request.input('email', sql.NVarChar(150), lead.email || null);
    request.input('segment', sql.VarChar(50), lead.segment || null);
    request.input('segmentLabel', sql.NVarChar(100), lead.segmentLabel || null);
    request.input('revenue', sql.VarChar(50), lead.revenue || null);
    request.input('revenueLabel', sql.NVarChar(100), lead.revenueLabel || null);
    request.input('pains', sql.NVarChar(sql.MAX), painsStr);
    request.input('currentSystem', sql.VarChar(50), lead.currentSystem || null);
    request.input('urgency', sql.VarChar(50), lead.urgency || null);
    request.input('score', sql.Int, typeof lead.score === 'number' ? lead.score : (parseInt(lead.score, 10) || 0));
    request.input('status', sql.VarChar(20), lead.status || 'cold');
    request.input('estimatedMonthlyLoss', sql.NVarChar(50), lead.estimatedMonthlyLoss || null);
    request.input('notes', sql.NVarChar(sql.MAX), lead.notes || null);

    const query = `
      MERGE [dbo].[leads] AS target
      USING (SELECT @id AS id) AS source
      ON (target.id = source.id)
      WHEN MATCHED THEN
        UPDATE SET 
          [timestamp] = @timestamp,
          [name] = @name,
          [company] = @company,
          [role] = @role,
          [whatsapp] = @whatsapp,
          [email] = @email,
          [segment] = @segment,
          [segmentLabel] = @segmentLabel,
          [revenue] = @revenue,
          [revenueLabel] = @revenueLabel,
          [pains] = @pains,
          [currentSystem] = @currentSystem,
          [urgency] = @urgency,
          [score] = @score,
          [status] = @status,
          [estimatedMonthlyLoss] = @estimatedMonthlyLoss,
          [estimatedMonthlyHours] = @estimatedMonthlyHours,
          [notes] = @notes,
          [updated_at] = SYSDATETIMEOFFSET()
      WHEN NOT MATCHED THEN
        INSERT (
          [id], [timestamp], [name], [company], [role], [whatsapp], [email],
          [segment], [segmentLabel], [revenue], [revenueLabel], [pains],
          [currentSystem], [urgency], [score], [status],
          [estimatedMonthlyLoss], [estimatedMonthlyHours], [notes]
        )
        VALUES (
          @id, @timestamp, @name, @company, @role, @whatsapp, @email,
          @segment, @segmentLabel, @revenue, @revenueLabel, @pains,
          @currentSystem, @urgency, @score, @status,
          @estimatedMonthlyLoss, @estimatedMonthlyHours, @notes
        );
    `;

    await request.query(query);

    return res.status(200).json({ success: true, message: 'Lead salvo no SQL Server com sucesso.', lead });
  } catch (error) {
    console.error('Erro ao salvar lead no SQL Server:', error);
    return res.status(500).json({ success: false, message: error.message || 'Erro ao persistir lead.' });
  }
});

/**
 * POST /api/leads/sync
 * Sincroniza em lote uma lista de leads
 */
app.post('/api/leads/sync', async (req, res) => {
  const { leads } = req.body;
  if (!Array.isArray(leads) || leads.length === 0) {
    return res.status(400).json({ success: false, message: 'Nenhum lead informado para sincronização.' });
  }

  try {
    const pool = await getPool();
    let savedCount = 0;

    for (const lead of leads) {
      if (!lead.id) continue;
      const request = pool.request();
      const painsStr = Array.isArray(lead.pains) ? JSON.stringify(lead.pains) : (lead.pains || '[]');
      const leadTimestamp = lead.timestamp ? new Date(lead.timestamp) : new Date();

      request.input('id', sql.VarChar(50), lead.id);
      request.input('timestamp', sql.DateTimeOffset, leadTimestamp);
      request.input('name', sql.NVarChar(150), lead.name || null);
      request.input('company', sql.NVarChar(150), lead.company || null);
      request.input('role', sql.NVarChar(100), lead.role || null);
      request.input('whatsapp', sql.VarChar(30), lead.whatsapp || null);
      request.input('email', sql.NVarChar(150), lead.email || null);
      request.input('segment', sql.VarChar(50), lead.segment || null);
      request.input('segmentLabel', sql.NVarChar(100), lead.segmentLabel || null);
      request.input('revenue', sql.VarChar(50), lead.revenue || null);
      request.input('revenueLabel', sql.NVarChar(100), lead.revenueLabel || null);
      request.input('pains', sql.NVarChar(sql.MAX), painsStr);
      request.input('currentSystem', sql.VarChar(50), lead.currentSystem || null);
      request.input('urgency', sql.VarChar(50), lead.urgency || null);
      request.input('score', sql.Int, typeof lead.score === 'number' ? lead.score : (parseInt(lead.score, 10) || 0));
      request.input('status', sql.VarChar(20), lead.status || 'cold');
      request.input('estimatedMonthlyLoss', sql.NVarChar(50), lead.estimatedMonthlyLoss || null);
      request.input('notes', sql.NVarChar(sql.MAX), lead.notes || null);

      const query = `
        MERGE [dbo].[leads] AS target
        USING (SELECT @id AS id) AS source
        ON (target.id = source.id)
        WHEN MATCHED THEN
          UPDATE SET 
            [timestamp] = @timestamp,
            [name] = @name,
            [company] = @company,
            [role] = @role,
            [whatsapp] = @whatsapp,
            [email] = @email,
            [segment] = @segment,
            [segmentLabel] = @segmentLabel,
            [revenue] = @revenue,
            [revenueLabel] = @revenueLabel,
            [pains] = @pains,
            [currentSystem] = @currentSystem,
            [urgency] = @urgency,
            [score] = @score,
            [status] = @status,
            [estimatedMonthlyLoss] = @estimatedMonthlyLoss,
            [estimatedMonthlyHours] = @estimatedMonthlyHours,
            [notes] = @notes,
            [updated_at] = SYSDATETIMEOFFSET()
        WHEN NOT MATCHED THEN
          INSERT (
            [id], [timestamp], [name], [company], [role], [whatsapp], [email],
            [segment], [segmentLabel], [revenue], [revenueLabel], [pains],
            [currentSystem], [urgency], [score], [status],
            [estimatedMonthlyLoss], [estimatedMonthlyHours], [notes]
          )
          VALUES (
            @id, @timestamp, @name, @company, @role, @whatsapp, @email,
            @segment, @segmentLabel, @revenue, @revenueLabel, @pains,
            @currentSystem, @urgency, @score, @status,
            @estimatedMonthlyLoss, @estimatedMonthlyHours, @notes
          );
      `;

      await request.query(query);
      savedCount++;
    }

    return res.json({ success: true, count: savedCount, message: `${savedCount} leads sincronizados no SQL Server.` });
  } catch (error) {
    console.error('Erro na sincronização em lote no SQL Server:', error);
    return res.status(500).json({ success: false, message: error.message || 'Erro ao sincronizar leads.' });
  }
});

/**
 * DELETE /api/leads/:id
 * Remove um lead do SQL Server
 */
app.delete('/api/leads/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: 'ID do lead é obrigatório.' });
  }

  try {
    const pool = await getPool();
    const request = pool.request();
    request.input('id', sql.VarChar(50), id);
    await request.query('DELETE FROM [dbo].[leads] WHERE [id] = @id');

    return res.json({ success: true, message: `Lead ${id} removido do SQL Server com sucesso.` });
  } catch (error) {
    console.error('Erro ao deletar lead no SQL Server:', error);
    return res.status(500).json({ success: false, message: error.message || 'Erro ao deletar lead.' });
  }
});

// Inicialização do servidor HTTP
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 AzurraERP Lead Server rodando na porta ${PORT}`);
  console.log(`📱 Front-end Totem/Cliente: http://localhost:${PORT}/index.html`);
  console.log(`🔒 Painel do Stand / Admin: http://localhost:${PORT}/admin.html`);
  console.log(`🔌 API SQL Server Health:   http://localhost:${PORT}/api/health`);
  console.log('====================================================');
});
