-- =====================================================
-- BANCO DE DADOS: GESTÃO DE FROTA DE CAMINHÕES
-- TCC - Script Final (CORRIGIDO)
-- =====================================================

CREATE DATABASE IF NOT EXISTS gestao_frota;
USE gestao_frota;

-- =========================
-- TABELA DE EMPRESAS
-- (necessária para id_empresa funcionar)
-- =========================
CREATE TABLE IF NOT EXISTS empresa (
    id_empresa  INT AUTO_INCREMENT PRIMARY KEY,
    nome        VARCHAR(100) NOT NULL,
    cnpj        VARCHAR(20),
    ativo       TINYINT(1) DEFAULT 1
);

-- =========================
-- TABELA DE USUÁRIOS
-- =========================
CREATE TABLE user (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nome            VARCHAR(100) NOT NULL,
    login           VARCHAR(50)  NOT NULL UNIQUE,
    senha           VARCHAR(255) NOT NULL,
    nivel_acesso    VARCHAR(50)  NOT NULL,
    id_empresa      INT,                                 -- FIX: adicionado para multiempresa
    ativo           TINYINT(1)   DEFAULT 1,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id_empresa)
        ON DELETE SET NULL ON UPDATE CASCADE
);

-- =========================
-- TABELA DE VEÍCULOS
-- =========================
CREATE TABLE controle_veiculo (
    id_veiculo          INT AUTO_INCREMENT PRIMARY KEY,
    placa               VARCHAR(10)  NOT NULL UNIQUE,
    modelo              VARCHAR(100) NOT NULL,
    marca               VARCHAR(100) NOT NULL,
    ano                 YEAR         NOT NULL,
    tipo_veiculo        VARCHAR(50)  NOT NULL,
    tipo_combustivel    VARCHAR(30)  NOT NULL,
    quilometragem       INT          NOT NULL,
    capacidade_carga_kg DECIMAL(10,2),
    status_veiculo      VARCHAR(50)  NOT NULL,
    id_empresa          INT,                             -- FIX: adicionado
    ativo               TINYINT(1)   DEFAULT 1,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id_empresa)
        ON DELETE SET NULL ON UPDATE CASCADE
);

-- FIX: índices para acelerar as queries principais
CREATE INDEX idx_veiculo_empresa_ativo ON controle_veiculo(id_empresa, ativo);

-- =========================
-- TABELA DE MOTORISTAS
-- =========================
CREATE TABLE motorista (
    id_motorista        INT AUTO_INCREMENT PRIMARY KEY,
    nome                VARCHAR(100) NOT NULL,
    cnh                 VARCHAR(20)  NOT NULL UNIQUE,
    categoria_cnh       VARCHAR(5)   NOT NULL,
    vencimento_cnh      DATE         NOT NULL,
    data_nascimento     DATE,
    telefone            VARCHAR(20),
    status_motorista    VARCHAR(50),
    id_empresa          INT,                             -- FIX: adicionado
    ativo               TINYINT(1)   DEFAULT 1,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id_empresa)
        ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX idx_motorista_empresa_ativo ON motorista(id_empresa, ativo);

-- =========================
-- TABELA DE MANUTENÇÃO
-- =========================
CREATE TABLE controle_manutencao (
    id_manutencao               INT AUTO_INCREMENT PRIMARY KEY,
    id_veiculo                  INT          NOT NULL,
    tipo_manutencao             VARCHAR(50)  NOT NULL,
    data_manutencao             DATE         NOT NULL,
    descricao_servico           VARCHAR(255) NOT NULL,
    custo                       DECIMAL(10,2) NOT NULL,
    quilometragem_manutencao    INT          NOT NULL,
    oficina                     VARCHAR(100),
    id_empresa                  INT,                     -- FIX: adicionado
    FOREIGN KEY (id_veiculo) REFERENCES controle_veiculo(id_veiculo)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id_empresa)
        ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX idx_manutencao_empresa ON controle_manutencao(id_empresa);

-- =========================
-- TABELA DE MANUTENÇÃO PREVENTIVA
-- =========================
CREATE TABLE manutencao_preventiva (
    id_preventiva           INT AUTO_INCREMENT PRIMARY KEY,
    id_veiculo              INT          NOT NULL,
    tipo_servico            VARCHAR(100) NOT NULL,
    data_prevista           DATE,
    quilometragem_prevista  INT,
    status                  VARCHAR(50)  DEFAULT 'Pendente',
    observacoes             TEXT,
    id_empresa              INT,                         -- FIX: adicionado
    FOREIGN KEY (id_veiculo) REFERENCES controle_veiculo(id_veiculo)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id_empresa)
        ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX idx_preventiva_empresa ON manutencao_preventiva(id_empresa);

-- =========================
-- TABELA DE MULTAS
-- =========================
CREATE TABLE controle_multas (
    id_multa        INT AUTO_INCREMENT PRIMARY KEY,
    id_veiculo      INT,
    id_motorista    INT,
    data_infracao   DATE          NOT NULL,
    tipo_multa      VARCHAR(100)  NOT NULL,
    valor_multa     DECIMAL(10,2) NOT NULL,
    situacao_multa  VARCHAR(50)   NOT NULL,
    id_empresa      INT,                                 -- FIX: adicionado
    FOREIGN KEY (id_veiculo) REFERENCES controle_veiculo(id_veiculo)
        ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (id_motorista) REFERENCES motorista(id_motorista)
        ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id_empresa)
        ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX idx_multas_empresa ON controle_multas(id_empresa);

-- =========================
-- TABELA DE VIAGENS
-- =========================
CREATE TABLE controle_viagem (
    id_viagem               INT AUTO_INCREMENT PRIMARY KEY,
    id_veiculo              INT,
    id_motorista            INT,
    data_saida              DATETIME     NOT NULL,
    data_retorno            DATETIME,
    origem                  VARCHAR(100) NOT NULL,
    destino                 VARCHAR(100) NOT NULL,
    finalidade              VARCHAR(255),
    quilometragem_inicial   INT          NOT NULL,
    quilometragem_final     INT,
    carga_transportada      VARCHAR(255),
    peso_carga_kg           DECIMAL(10,2),
    id_empresa              INT,                         -- FIX: adicionado
    FOREIGN KEY (id_veiculo) REFERENCES controle_veiculo(id_veiculo)
        ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (id_motorista) REFERENCES motorista(id_motorista)
        ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id_empresa)
        ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX idx_viagem_empresa ON controle_viagem(id_empresa);

-- =========================
-- TABELA DE ABASTECIMENTO
-- =========================
CREATE TABLE abastecimento (
    id_abastecimento            INT AUTO_INCREMENT PRIMARY KEY,
    id_veiculo                  INT,
    id_motorista                INT,
    data_abastecimento          DATE          NOT NULL,
    tipo_combustivel            VARCHAR(30)   NOT NULL,
    quantidade_litros           DECIMAL(10,2) NOT NULL,
    valor_litro                 DECIMAL(10,2) NOT NULL,
    valor_total                 DECIMAL(10,2) NOT NULL,
    quilometragem_abastecimento INT           NOT NULL,
    posto_combustivel           VARCHAR(100),
    id_empresa                  INT,                     -- FIX: adicionado
    FOREIGN KEY (id_veiculo) REFERENCES controle_veiculo(id_veiculo)
        ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (id_motorista) REFERENCES motorista(id_motorista)
        ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id_empresa)
        ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX idx_abastecimento_empresa ON abastecimento(id_empresa);

-- =========================
-- TABELA DE DOCUMENTOS DO VEÍCULO
-- =========================
CREATE TABLE documentos_veiculo (
    id_documento        INT AUTO_INCREMENT PRIMARY KEY,
    id_veiculo          INT          NOT NULL,
    tipo_documento      VARCHAR(50)  NOT NULL,
    data_emissao        DATE,
    data_vencimento     DATE         NOT NULL,
    numero_documento    VARCHAR(100),
    arquivo_path        VARCHAR(255),
    status              VARCHAR(30)  DEFAULT 'Válido',
    FOREIGN KEY (id_veiculo) REFERENCES controle_veiculo(id_veiculo)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- =========================
-- TABELA DE RELATÓRIOS
-- =========================
CREATE TABLE relatorios (
    id_relatorio    INT AUTO_INCREMENT PRIMARY KEY,
    tipo_relatorio  VARCHAR(100) NOT NULL,
    data_geracao    DATETIME     DEFAULT CURRENT_TIMESTAMP,
    id_usuario      INT,
    FOREIGN KEY (id_usuario) REFERENCES user(id)
        ON DELETE SET NULL ON UPDATE CASCADE
);

-- =========================
-- TABELA DE REGISTRO DA CÂMERA
-- =========================
CREATE TABLE registro_camera (
    id_registro         INT AUTO_INCREMENT PRIMARY KEY,
    id_veiculo          INT,
    id_viagem           INT,
    data_hora           DATETIME     NOT NULL,
    tipo_evento         VARCHAR(50),
    imagem_path         VARCHAR(255),
    placa_detectada     VARCHAR(10),
    observacao          TEXT,
    FOREIGN KEY (id_veiculo) REFERENCES controle_veiculo(id_veiculo)
        ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (id_viagem) REFERENCES controle_viagem(id_viagem)
        ON DELETE SET NULL ON UPDATE CASCADE
);

-- =========================
-- DADOS INICIAIS
-- =========================
INSERT INTO empresa (nome, cnpj) VALUES ('Empresa Padrão', '00.000.000/0001-00');

INSERT INTO user (nome, login, senha, nivel_acesso, id_empresa, ativo)
VALUES ('Administrador', 'admin', '123', 'admin', 1, 1);
-- =====================================================
-- DADOS DE EXEMPLO — GESTÃO DE FROTA
-- Empresa: Transportadora Horizonte Ltda
-- =====================================================

-- =========================
-- EMPRESA
-- =========================
-- (já inserida como id=1 no script base, aqui atualizamos para ficar mais real)
UPDATE empresa SET nome = 'Transportadora Horizonte Ltda', cnpj = '12.345.678/0001-99' WHERE id_empresa = 1;

-- =========================
-- USUÁRIOS
-- =========================
-- admin já existe (id=1), adicionamos mais dois
INSERT INTO user (nome, login, senha, nivel_acesso, id_empresa, ativo) VALUES
('Carlos Gerente',  'carlos',  '123', 'gerente',   1, 1),
('Ana Operadora',   'ana',     '123', 'operador',  1, 1);

-- =========================
-- VEÍCULOS (8 caminhões)
-- =========================
INSERT INTO controle_veiculo (placa, modelo, marca, ano, tipo_veiculo, tipo_combustivel, quilometragem, capacidade_carga_kg, status_veiculo, id_empresa, ativo) VALUES
('ABC1D23', 'Actros 2651',       'Mercedes-Benz', 2021, 'Carreta',        'Diesel S-10',  198450, 27000.00, 'Disponível',     1, 1),
('DEF4G56', 'FH 540',            'Volvo',         2022, 'Carreta',        'Diesel S-10',  143200, 25000.00, 'Em viagem',      1, 1),
('GHI7J89', 'XF 480',            'DAF',           2020, 'Carreta',        'Diesel S-500', 267800, 26000.00, 'Disponível',     1, 1),
('JKL2M34', 'Meteor 2730',       'Mercedes-Benz', 2023, 'Bitruck',        'Diesel S-10',   82100, 18000.00, 'Disponível',     1, 1),
('MNO5P67', '1933',              'Scania',        2019, 'Caminhão Toco',  'Diesel S-500', 312400, 12000.00, 'Em manutenção',  1, 1),
('PQR8S01', 'Constellation 17',  'Volkswagen',    2020, 'Caminhão Toco',  'Diesel S-10',  204600, 13000.00, 'Disponível',     1, 1),
('TUV3W45', 'Atego 2430',        'Mercedes-Benz', 2021, 'Bitruck',        'Diesel S-10',  156900, 15000.00, 'Em viagem',      1, 1),
('XYZ6A78', 'P 360',             'Scania',        2018, 'Carreta',        'Diesel S-500', 389200, 24000.00, 'Disponível',     1, 1);

-- =========================
-- MOTORISTAS (8 motoristas)
-- =========================
INSERT INTO motorista (nome, cnh, categoria_cnh, vencimento_cnh, data_nascimento, telefone, status_motorista, id_empresa, ativo) VALUES
('José Aparecido Silva',    '12345678900', 'E', '2026-08-15', '1980-03-12', '(11) 99821-4400', 'Ativo',      1, 1),
('Marcos Oliveira Santos',  '98765432100', 'E', '2027-02-20', '1985-07-22', '(11) 98734-5511', 'Ativo',      1, 1),
('Rodrigo Ferreira Lima',   '11122233300', 'E', '2025-11-30', '1978-11-05', '(19) 99651-2233', 'Ativo',      1, 1),
('Paulo Ricardo Mendes',    '44455566600', 'C', '2026-05-10', '1990-01-18', '(11) 97842-6644', 'Ativo',      1, 1),
('Antonio Carlos Ramos',    '77788899900', 'E', '2027-09-01', '1975-06-30', '(14) 99512-7755', 'De férias',  1, 1),
('Fábio Henrique Costa',    '33344455500', 'D', '2026-03-25', '1988-09-14', '(11) 98123-8866', 'Ativo',      1, 1),
('Wellington Souza Barros', '66677788800', 'E', '2028-01-12', '1992-04-03', '(11) 99034-9977', 'Ativo',      1, 1),
('Edson Luiz Pereira',      '55566677700', 'E', '2025-12-05', '1983-12-28', '(15) 97765-0011', 'Afastado',   1, 1);

-- =========================
-- VIAGENS (12 viagens — mistura de concluídas e em andamento)
-- =========================
INSERT INTO controle_viagem (id_veiculo, id_motorista, data_saida, data_retorno, origem, destino, finalidade, quilometragem_inicial, quilometragem_final, carga_transportada, peso_carga_kg, id_empresa) VALUES
-- concluídas
(1, 1, '2025-01-08 06:00:00', '2025-01-09 18:30:00', 'São Paulo - SP',    'Curitiba - PR',      'Entrega de autopeças',      195000, 196230, 'Autopeças diversas',       18500.00, 1),
(3, 3, '2025-01-15 05:30:00', '2025-01-16 20:00:00', 'São Paulo - SP',    'Porto Alegre - RS',  'Entrega de eletrodomésticos',264000, 266380, 'Eletrodomésticos',         22000.00, 1),
(6, 6, '2025-02-03 07:00:00', '2025-02-04 17:00:00', 'Campinas - SP',     'Belo Horizonte - MG','Entrega de alimentos',      202000, 203550, 'Alimentos não perecíveis', 11000.00, 1),
(4, 4, '2025-02-18 06:30:00', '2025-02-19 16:30:00', 'São Paulo - SP',    'Rio de Janeiro - RJ','Transporte de materiais',    80000,  80840, 'Material de construção',   16000.00, 1),
(1, 2, '2025-03-05 05:00:00', '2025-03-06 21:00:00', 'São Paulo - SP',    'Recife - PE',        'Entrega de têxteis',        196230, 199420, 'Tecidos e confecções',     20000.00, 1),
(8, 1, '2025-03-20 06:00:00', '2025-03-21 19:00:00', 'São Paulo - SP',    'Fortaleza - CE',     'Transporte de eletrônicos', 386000, 389200, 'Eletrônicos embalados',    21500.00, 1),
(3, 7, '2025-04-10 07:00:00', '2025-04-11 17:30:00', 'Ribeirão Preto - SP','Goiânia - GO',      'Entrega de máquinas',       266380, 267800, 'Máquinas agrícolas',       24000.00, 1),
(6, 6, '2025-04-22 06:00:00', '2025-04-23 20:00:00', 'São Paulo - SP',    'Cuiabá - MT',        'Carga frigorífica',         203550, 205300, 'Carnes resfriadas',        12500.00, 1),
(4, 4, '2025-05-07 05:30:00', '2025-05-08 18:00:00', 'São Paulo - SP',    'Salvador - BA',      'Entrega de cosméticos',      80840,  81980, 'Cosméticos e perfumaria',  14000.00, 1),
(1, 2, '2025-05-19 06:00:00', '2025-05-20 22:00:00', 'São Paulo - SP',    'Manaus - AM',        'Transporte de peças',       199420, 202900, 'Peças industriais',        19000.00, 1),
-- em andamento (sem data_retorno)
(2, 3, '2025-06-08 06:00:00', NULL, 'São Paulo - SP',    'Curitiba - PR',      'Entrega de bebidas',        143200, NULL, 'Bebidas diversas',         20000.00, 1),
(7, 7, '2025-06-09 05:30:00', NULL, 'Campinas - SP',     'Belo Horizonte - MG','Transporte de papel',       156900, NULL, 'Bobinas de papel',         15000.00, 1);

-- =========================
-- ABASTECIMENTOS (20 registros — últimos 6 meses)
-- =========================
INSERT INTO abastecimento (id_veiculo, id_motorista, data_abastecimento, tipo_combustivel, quantidade_litros, valor_litro, valor_total, quilometragem_abastecimento, posto_combustivel, id_empresa) VALUES
(1, 1, '2025-01-08', 'Diesel S-10',  320.00, 6.49, 2076.80, 195000, 'Posto Ipiranga BR-116',       1),
(3, 3, '2025-01-15', 'Diesel S-500', 290.00, 6.19, 1795.10, 264000, 'Posto Shell - Marginal Tietê',1),
(2, 2, '2025-01-20', 'Diesel S-10',  310.00, 6.52, 2021.20, 141000, 'Posto Petrobras - SP',        1),
(6, 6, '2025-02-03', 'Diesel S-10',  280.00, 6.47, 1811.60, 202000, 'Posto BR - Anhanguera',       1),
(4, 4, '2025-02-18', 'Diesel S-10',  150.00, 6.51,  976.50,  80000, 'Posto Ale - Osasco',          1),
(1, 2, '2025-03-05', 'Diesel S-10',  340.00, 6.55, 2227.00, 196230, 'Posto Ipiranga - Guarulhos',  1),
(8, 1, '2025-03-20', 'Diesel S-500', 370.00, 6.21, 2297.70, 386000, 'Posto Raízen - Rodovia',      1),
(5, 5, '2025-03-28', 'Diesel S-500', 200.00, 6.20, 1240.00, 310000, 'Posto Shell - ABC',           1),
(3, 7, '2025-04-10', 'Diesel S-500', 300.00, 6.22, 1866.00, 266380, 'Posto BR - Ribeirão Preto',   1),
(6, 6, '2025-04-22', 'Diesel S-10',  260.00, 6.58, 1710.80, 203550, 'Posto Ipiranga - Campinas',   1),
(4, 4, '2025-05-07', 'Diesel S-10',  160.00, 6.60, 1056.00,  80840, 'Posto Petrobras - SP Centro', 1),
(1, 2, '2025-05-19', 'Diesel S-10',  350.00, 6.63, 2320.50, 199420, 'Posto Raízen - Guarulhos',    1),
(2, 3, '2025-05-25', 'Diesel S-10',  315.00, 6.61, 2082.15, 142200, 'Posto BR - Marginal',         1),
(7, 7, '2025-06-01', 'Diesel S-10',  240.00, 6.65, 1596.00, 155800, 'Posto Ipiranga - Campinas',   1),
(6, 6, '2025-06-04', 'Diesel S-10',  270.00, 6.67, 1800.90, 205300, 'Posto Shell - Anhanguera',    1),
(8, 1, '2025-06-05', 'Diesel S-500', 360.00, 6.25, 2250.00, 389200, 'Posto BR - Rodovia',          1),
(4, 4, '2025-06-06', 'Diesel S-10',  145.00, 6.68,  968.60,  81980, 'Posto Ale - SP',              1),
(3, 3, '2025-06-07', 'Diesel S-500', 285.00, 6.26, 1784.10, 267800, 'Posto Petrobras - Interior',  1),
(2, 2, '2025-06-08', 'Diesel S-10',  308.00, 6.70, 2063.60, 143200, 'Posto Ipiranga BR-116',       1),
(7, 7, '2025-06-09', 'Diesel S-10',  235.00, 6.71, 1576.85, 156900, 'Posto Shell - Rodovia',       1);

-- =========================
-- MANUTENÇÕES REALIZADAS (10 registros)
-- =========================
INSERT INTO controle_manutencao (id_veiculo, tipo_manutencao, data_manutencao, descricao_servico, custo, quilometragem_manutencao, oficina, id_empresa) VALUES
(1, 'Preventiva', '2025-01-20', 'Troca de óleo e filtros',                      980.00, 195500,  'Oficina Central Trucks',        1),
(5, 'Corretiva',  '2025-02-10', 'Substituição de pastilhas de freio dianteiras', 1450.00, 308000, 'MecaTrans Serviços',            1),
(3, 'Preventiva', '2025-02-25', 'Revisão dos 250.000 km — troca de correias',   2300.00, 265000,  'DAF Service Campinas',          1),
(8, 'Corretiva',  '2025-03-12', 'Reparo no sistema de injeção eletrônica',      3800.00, 385000,  'Oficina Central Trucks',        1),
(6, 'Preventiva', '2025-03-30', 'Troca de pneus eixo traseiro (4 pneus)',       5600.00, 203000,  'Borracharia Rodoviária SP',     1),
(2, 'Preventiva', '2025-04-05', 'Troca de óleo diferencial e caixa de câmbio',  1750.00, 141500, 'Volvo Trucks Serviços',         1),
(5, 'Corretiva',  '2025-04-18', 'Substituição do radiador',                     2900.00, 310500,  'MecaTrans Serviços',            1),
(1, 'Preventiva', '2025-05-10', 'Alinhamento, balanceamento e rodízio de pneus', 620.00, 197000, 'Borracharia Rodoviária SP',     1),
(4, 'Corretiva',  '2025-05-28', 'Reparo no sistema elétrico — alternador',      1800.00,  81200,  'Auto Elétrica Rápida',         1),
(5, 'Corretiva',  '2025-06-05', 'Troca de embreagem completa',                  4200.00, 312400,  'Oficina Central Trucks',        1);

-- =========================
-- MANUTENÇÃO PREVENTIVA AGENDADA (8 registros)
-- =========================
INSERT INTO manutencao_preventiva (id_veiculo, tipo_servico, data_prevista, quilometragem_prevista, status, observacoes, id_empresa) VALUES
(1, 'Troca de óleo e filtros',          '2025-07-10', 200000, 'Pendente',  'Trocar óleo 15W40 + filtro de óleo e ar',                        1),
(2, 'Revisão dos 150.000 km',           '2025-07-15', 150000, 'Pendente',  'Revisão completa conforme manual Volvo',                         1),
(3, 'Troca de pneus eixo dianteiro',    '2025-07-20', 270000, 'Pendente',  '2 pneus 295/80R22.5 - já cotados',                               1),
(6, 'Troca de óleo e filtros',          '2025-07-08', 206000, 'Pendente',  'Óleo sintético 10W40',                                           1),
(7, 'Alinhamento e balanceamento',      '2025-06-20', 158000, 'Atrasada',  'Atrasada desde 05/06 — prioridade alta',                         1),
(4, 'Revisão do sistema de freios',     '2025-08-01',  85000, 'Pendente',  'Verificar desgaste de lonas e discos',                           1),
(8, 'Troca de correias e tensores',     '2025-08-10', 395000, 'Pendente',  'Correias dentadas e poli-V',                                     1),
(2, 'Troca de pneus eixo traseiro',     '2025-06-15', 145000, 'Concluída', 'Concluída em 14/06/2025 — 4 pneus novos instalados',             1);

-- =========================
-- MULTAS (8 registros)
-- =========================
INSERT INTO controle_multas (id_veiculo, id_motorista, data_infracao, tipo_multa, valor_multa, situacao_multa, id_empresa) VALUES
(2, 3, '2025-01-22', 'Excesso de velocidade (radar)',  293.47, 'Paga',     1),
(6, 6, '2025-02-14', 'Estacionamento proibido',         88.38, 'Paga',     1),
(1, 1, '2025-03-08', 'Excesso de velocidade (radar)',  195.23, 'Pendente', 1),
(3, 7, '2025-03-25', 'Avanço de sinal vermelho',       293.47, 'Recurso',  1),
(8, 1, '2025-04-11', 'Excesso de peso na balança',     550.00, 'Pendente', 1),
(4, 4, '2025-04-29', 'Uso de faixa exclusiva',         130.16, 'Paga',     1),
(2, 2, '2025-05-17', 'Excesso de velocidade (radar)',  195.23, 'Pendente', 1),
(7, 7, '2025-06-02', 'Documento com prazo vencido',    293.47, 'Pendente', 1);

-- =========================
-- DOCUMENTOS DOS VEÍCULOS
-- =========================
INSERT INTO documentos_veiculo (id_veiculo, tipo_documento, data_emissao, data_vencimento, numero_documento, status) VALUES
(1, 'CRLV',   '2025-01-02', '2025-12-31', 'CRLV-2025-001-SP', 'Válido'),
(1, 'Seguro', '2025-01-05', '2026-01-04', 'AP-00123456',       'Válido'),
(2, 'CRLV',   '2025-01-02', '2025-12-31', 'CRLV-2025-002-SP', 'Válido'),
(2, 'IPVA',   '2025-02-10', '2025-12-31', 'IPVA-2025-002',     'Válido'),
(3, 'CRLV',   '2025-01-02', '2025-12-31', 'CRLV-2025-003-SP', 'Válido'),
(4, 'CRLV',   '2025-01-02', '2025-12-31', 'CRLV-2025-004-SP', 'Válido'),
(4, 'Seguro', '2025-01-10', '2026-01-09', 'AP-00789012',       'Válido'),
(5, 'CRLV',   '2025-01-02', '2025-12-31', 'CRLV-2025-005-SP', 'Válido'),
(5, 'Seguro', '2024-06-01', '2025-05-31', 'AP-00456789',       'Vencido'),
(6, 'CRLV',   '2025-01-02', '2025-12-31', 'CRLV-2025-006-SP', 'Válido'),
(7, 'CRLV',   '2025-01-02', '2025-12-31', 'CRLV-2025-007-SP', 'Válido'),
(7, 'Vistoria','2025-03-15','2026-03-14', 'VST-2025-007',      'Válido'),
(8, 'CRLV',   '2025-01-02', '2025-12-31', 'CRLV-2025-008-SP', 'Válido'),
(8, 'IPVA',   '2025-01-20', '2025-12-31', 'IPVA-2025-008',     'A vencer');
