CREATE DATABASE IF NOT EXISTS gestao_frota;
USE gestao_frota;

CREATE TABLE empresa (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  nome  VARCHAR(100) NOT NULL,
  cnpj  VARCHAR(20),
  ativo TINYINT(1) DEFAULT 1
);

CREATE TABLE `user` (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  nome         VARCHAR(100) NOT NULL,
  login        VARCHAR(50)  NOT NULL UNIQUE,
  senha        VARCHAR(255) NOT NULL,
  nivel_acesso VARCHAR(50)  NOT NULL,
  ativo        TINYINT(1)   DEFAULT 1,
  id_empresa   INT,
  FOREIGN KEY (id_empresa) REFERENCES empresa(id)
);

CREATE TABLE controle_veiculo (
  id_veiculo          INT AUTO_INCREMENT PRIMARY KEY,
  placa               VARCHAR(10)   NOT NULL UNIQUE,
  modelo              VARCHAR(100)  NOT NULL,
  marca               VARCHAR(100)  NOT NULL,
  ano                 YEAR          NOT NULL,
  tipo_veiculo        VARCHAR(50)   NOT NULL,
  tipo_combustivel    VARCHAR(30)   NOT NULL,
  quilometragem       INT           NOT NULL,
  capacidade_carga_kg DECIMAL(10,2),
  status_veiculo      VARCHAR(50)   NOT NULL,
  ativo               TINYINT(1)    DEFAULT 1,
  id_empresa          INT,
  FOREIGN KEY (id_empresa) REFERENCES empresa(id)
);

CREATE TABLE motorista (
  id_motorista     INT AUTO_INCREMENT PRIMARY KEY,
  nome             VARCHAR(100) NOT NULL,
  cnh              VARCHAR(20)  NOT NULL UNIQUE,
  categoria_cnh    VARCHAR(5)   NOT NULL,
  vencimento_cnh   DATE         NOT NULL,
  data_nascimento  DATE,
  telefone         VARCHAR(20),
  status_motorista VARCHAR(50),
  ativo            TINYINT(1)   DEFAULT 1,
  id_empresa       INT,
  FOREIGN KEY (id_empresa) REFERENCES empresa(id)
);

CREATE TABLE controle_manutencao (
  id_manutencao            INT AUTO_INCREMENT PRIMARY KEY,
  id_veiculo               INT          NOT NULL,
  tipo_manutencao          VARCHAR(50)  NOT NULL,
  data_manutencao          DATE         NOT NULL,
  descricao_servico        VARCHAR(255) NOT NULL,
  custo                    DECIMAL(10,2) NOT NULL,
  quilometragem_manutencao INT          NOT NULL,
  oficina                  VARCHAR(100),
  id_empresa               INT,
  FOREIGN KEY (id_veiculo) REFERENCES controle_veiculo(id_veiculo) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_empresa) REFERENCES empresa(id)
);

CREATE TABLE manutencao_preventiva (
  id_preventiva          INT AUTO_INCREMENT PRIMARY KEY,
  id_veiculo             INT          NOT NULL,
  tipo_servico           VARCHAR(100) NOT NULL,
  data_prevista          DATE,
  quilometragem_prevista INT,
  status                 VARCHAR(50)  DEFAULT 'Pendente',
  observacoes            TEXT,
  id_empresa             INT,
  FOREIGN KEY (id_veiculo) REFERENCES controle_veiculo(id_veiculo) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_empresa) REFERENCES empresa(id)
);

CREATE TABLE controle_multas (
  id_multa       INT AUTO_INCREMENT PRIMARY KEY,
  id_veiculo     INT,
  id_motorista   INT,
  data_infracao  DATE          NOT NULL,
  tipo_multa     VARCHAR(100)  NOT NULL,
  valor_multa    DECIMAL(10,2) NOT NULL,
  situacao_multa VARCHAR(50)   NOT NULL,
  id_empresa     INT,
  FOREIGN KEY (id_veiculo)   REFERENCES controle_veiculo(id_veiculo) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (id_motorista) REFERENCES motorista(id_motorista)      ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (id_empresa)   REFERENCES empresa(id)
);

CREATE TABLE controle_viagem (
  id_viagem             INT AUTO_INCREMENT PRIMARY KEY,
  id_veiculo            INT,
  id_motorista          INT,
  data_saida            DATETIME     NOT NULL,
  data_retorno          DATETIME,
  origem                VARCHAR(100) NOT NULL,
  destino               VARCHAR(100) NOT NULL,
  finalidade            VARCHAR(255),
  quilometragem_inicial INT          NOT NULL,
  quilometragem_final   INT,
  carga_transportada    VARCHAR(255),
  peso_carga_kg         DECIMAL(10,2),
  id_empresa            INT,
  FOREIGN KEY (id_veiculo)   REFERENCES controle_veiculo(id_veiculo) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (id_motorista) REFERENCES motorista(id_motorista)      ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (id_empresa)   REFERENCES empresa(id)
);

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
  id_empresa                  INT,
  FOREIGN KEY (id_veiculo)   REFERENCES controle_veiculo(id_veiculo) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (id_motorista) REFERENCES motorista(id_motorista)      ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (id_empresa)   REFERENCES empresa(id)
);

CREATE TABLE documentos_veiculo (
  id_documento     INT AUTO_INCREMENT PRIMARY KEY,
  id_veiculo       INT          NOT NULL,
  tipo_documento   VARCHAR(50)  NOT NULL,
  data_emissao     DATE,
  data_vencimento  DATE         NOT NULL,
  numero_documento VARCHAR(100),
  arquivo_path     VARCHAR(255),
  status           VARCHAR(30)  DEFAULT 'Válido',
  id_empresa       INT,
  FOREIGN KEY (id_veiculo) REFERENCES controle_veiculo(id_veiculo) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_empresa) REFERENCES empresa(id)
);

CREATE TABLE relatorios (
  id_relatorio   INT AUTO_INCREMENT PRIMARY KEY,
  tipo_relatorio VARCHAR(100) NOT NULL,
  data_geracao   DATETIME     DEFAULT CURRENT_TIMESTAMP,
  id_usuario     INT,
  FOREIGN KEY (id_usuario) REFERENCES `user`(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE registro_camera (
  id_registro     INT AUTO_INCREMENT PRIMARY KEY,
  id_veiculo      INT,
  id_viagem       INT,
  data_hora       DATETIME     NOT NULL,
  tipo_evento     VARCHAR(50),
  imagem_path     VARCHAR(255),
  placa_detectada VARCHAR(10),
  observacao      TEXT,
  FOREIGN KEY (id_veiculo) REFERENCES controle_veiculo(id_veiculo) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (id_viagem)  REFERENCES controle_viagem(id_viagem)   ON DELETE SET NULL ON UPDATE CASCADE
);

-- Dados iniciais
INSERT INTO empresa (nome, cnpj) VALUES ('Transportadora Teste', '00.000.000/0001-00');
INSERT INTO `user` (nome, login, senha, nivel_acesso, ativo, id_empresa) VALUES ('Administrador', 'admin', '123', 'admin', 1, 1);

-- Veículos de teste
INSERT INTO controle_veiculo (placa, modelo, marca, ano, tipo_veiculo, tipo_combustivel, quilometragem, capacidade_carga_kg, status_veiculo, ativo, id_empresa) VALUES
('ABC-1234', 'FH 460',              'Volvo',      2021, 'Carreta',       'Diesel S-10',  180000, 25000.00, 'Disponível',    1, 1),
('DEF-5678', 'Actros 2651',         'Mercedes',   2020, 'Bitruck',       'Diesel S-10',  220000, 18000.00, 'Em viagem',     1, 1),
('GHI-9012', 'Constellation 24280', 'Volkswagen', 2019, 'Caminhão Toco', 'Diesel S-500', 310000, 12000.00, 'Em manutenção', 1, 1);

-- Motoristas de teste
INSERT INTO motorista (nome, cnh, categoria_cnh, vencimento_cnh, data_nascimento, telefone, status_motorista, ativo, id_empresa) VALUES
('João Silva',  '12345678900', 'E', '2026-05-10', '1985-03-15', '(11) 99999-1111', 'Ativo',     1, 1),
('Carlos Lima', '98765432100', 'D', '2025-11-20', '1990-07-22', '(11) 99999-2222', 'Ativo',     1, 1),
('Pedro Souza', '11122233344', 'E', '2027-02-14', '1988-01-30', '(11) 99999-3333', 'De férias', 1, 1);