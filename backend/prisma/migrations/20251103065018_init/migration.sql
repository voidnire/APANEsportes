-- CreateTable
CREATE TABLE `Usuario` (
    `id` CHAR(36) NOT NULL,
    `nomeCompleto` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `senhaHash` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Atleta` (
    `id` CHAR(36) NOT NULL,
    `nomeCompleto` VARCHAR(255) NOT NULL,
    `dataNascimento` DATE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `usuarioId` CHAR(36) NOT NULL,

    INDEX `Atleta_nomeCompleto_idx`(`nomeCompleto`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RegistroAvaliacao` (
    `id` CHAR(36) NOT NULL,
    `dataHora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tipo` ENUM('PRE_TREINO', 'POS_TREINO') NOT NULL,
    `observacoes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `atletaId` CHAR(36) NOT NULL,
    `modalidadeId` CHAR(36) NOT NULL,

    INDEX `RegistroAvaliacao_atletaId_dataHora_idx`(`atletaId`, `dataHora`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResultadoMetrica` (
    `id` CHAR(36) NOT NULL,
    `valor` DECIMAL(10, 3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `registroId` CHAR(36) NOT NULL,
    `tipoMetricaId` CHAR(36) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Classificacao` (
    `id` CHAR(36) NOT NULL,
    `codigo` VARCHAR(10) NOT NULL,
    `descricao` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Classificacao_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Modalidade` (
    `id` CHAR(36) NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `categoria` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Modalidade_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoMetrica` (
    `id` CHAR(36) NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `unidadeMedida` VARCHAR(10) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TipoMetrica_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AtletaClassificacao` (
    `id` CHAR(36) NOT NULL,
    `atletaId` CHAR(36) NOT NULL,
    `classificacaoId` CHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `AtletaClassificacao_atletaId_classificacaoId_key`(`atletaId`, `classificacaoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ModalidadeTipoMetrica` (
    `id` CHAR(36) NOT NULL,
    `modalidadeId` CHAR(36) NOT NULL,
    `tipoMetricaId` CHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ModalidadeTipoMetrica_modalidadeId_tipoMetricaId_key`(`modalidadeId`, `tipoMetricaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Atleta` ADD CONSTRAINT `Atleta_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegistroAvaliacao` ADD CONSTRAINT `RegistroAvaliacao_atletaId_fkey` FOREIGN KEY (`atletaId`) REFERENCES `Atleta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegistroAvaliacao` ADD CONSTRAINT `RegistroAvaliacao_modalidadeId_fkey` FOREIGN KEY (`modalidadeId`) REFERENCES `Modalidade`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResultadoMetrica` ADD CONSTRAINT `ResultadoMetrica_registroId_fkey` FOREIGN KEY (`registroId`) REFERENCES `RegistroAvaliacao`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResultadoMetrica` ADD CONSTRAINT `ResultadoMetrica_tipoMetricaId_fkey` FOREIGN KEY (`tipoMetricaId`) REFERENCES `TipoMetrica`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AtletaClassificacao` ADD CONSTRAINT `AtletaClassificacao_atletaId_fkey` FOREIGN KEY (`atletaId`) REFERENCES `Atleta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AtletaClassificacao` ADD CONSTRAINT `AtletaClassificacao_classificacaoId_fkey` FOREIGN KEY (`classificacaoId`) REFERENCES `Classificacao`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ModalidadeTipoMetrica` ADD CONSTRAINT `ModalidadeTipoMetrica_modalidadeId_fkey` FOREIGN KEY (`modalidadeId`) REFERENCES `Modalidade`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ModalidadeTipoMetrica` ADD CONSTRAINT `ModalidadeTipoMetrica_tipoMetricaId_fkey` FOREIGN KEY (`tipoMetricaId`) REFERENCES `TipoMetrica`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
