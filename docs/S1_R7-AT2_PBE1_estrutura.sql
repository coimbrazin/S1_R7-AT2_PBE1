-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: rapido&seguro
-- ------------------------------------------------------
-- Server version	8.0.36

-- Christopher e Cauan

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cpf` char(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `cpf_UNIQUE` (`cpf`),
  UNIQUE KEY `telefone_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `enderecos`
--

DROP TABLE IF EXISTS `enderecos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enderecos` (
  `id_endereco` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int NOT NULL,
  `cep` varchar(9) NOT NULL,
  `uf` char(2) NOT NULL,
  `cidade` varchar(50) NOT NULL,
  `bairro` varchar(50) NOT NULL,
  `logradouro` varchar(100) NOT NULL,
  `numero` varchar(10) NOT NULL,
  `complemento` varchar(50) NOT NULL,
  PRIMARY KEY (`id_endereco`),
  KEY `fk_enderecos_clientes1_idx` (`id_cliente`),
  CONSTRAINT `fk_enderecos_clientes1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `entregas`
--

DROP TABLE IF EXISTS `entregas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entregas` (
  `id_entrega` int NOT NULL AUTO_INCREMENT,
  `id_pedido` int NOT NULL,
  `valor_da_distancia` decimal(10,2) NOT NULL,
  `valor_do_peso` decimal(10,2) NOT NULL,
  `acrescimo` decimal(10,2) DEFAULT NULL,
  `desconto` decimal(10,2) DEFAULT NULL,
  `taxa_extra` decimal(10,2) DEFAULT NULL,
  `valor_final` decimal(10,2) NOT NULL,
  `status_entrega` enum('calculado','em transito','entregue','cancelado') NOT NULL,
  PRIMARY KEY (`id_entrega`),
  KEY `fk_entregas_pedidos1_idx` (`id_pedido`),
  CONSTRAINT `fk_entregas_pedidos1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id_pedido` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int NOT NULL,
  `id_endereco` int NOT NULL,
  `data_do_pedido` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `tipo_de_entrega` enum('normal','urgente') NOT NULL,
  `distancia` decimal(10,2) NOT NULL,
  `peso_da_carga` decimal(10,2) NOT NULL,
  `valor_base_por_km` decimal(10,2) NOT NULL,
  `valor_base_por_kg` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `fk_pedidos_clientes1_idx` (`id_cliente`),
  KEY `fk_pedidos_enderecos1_idx` (`id_endereco`),
  CONSTRAINT `fk_pedidos_clientes1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  CONSTRAINT `fk_pedidos_enderecos1` FOREIGN KEY (`id_endereco`) REFERENCES `enderecos` (`id_endereco`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `trg_calcular_entrega` AFTER INSERT ON `pedidos` FOR EACH ROW begin
	declare v_valor_distancia decimal(10,2);
    declare v_valor_peso decimal(10,2);
    declare v_valor_base decimal(10,2);
    declare v_acrescimo decimal(10,2);
    declare v_valor_final decimal(10,2);
    declare v_desconto decimal(10,2);
    declare v_taxa_extra decimal(10,2);
    
    -- Calcular valor da distancia
    set v_valor_distancia = new.distancia * new.valor_base_por_km;
    
    
    -- Calcular valor da carga
    set v_valor_peso = new.peso_da_carga * new.valor_base_por_kg;
    
    
    -- Calcular preco base
    set v_valor_base = v_valor_distancia + v_valor_peso;
    
    
    -- Calculando acrescimo de 20% se o tipo de entrega for 'urgente'
    if new.tipo_de_entrega = 'urgente' then
		set v_acrescimo = v_valor_base * 0.20;
    else
		set v_acrescimo = 0;
	end if;
    
    set v_valor_final = v_valor_base + v_acrescimo;
    
    
    -- Calculando o desconto de 10% se o valor final for maior que 500
    if v_valor_final > 500 then
		set v_desconto = v_valor_final * 0.10;
        set v_valor_final = v_valor_final - v_desconto;
	else
		set v_desconto = 0;
	end if;
    
    
    -- Calculando a taxa extra por peso 15 a mais se tiver peso superior a 50kg
    if new.peso_da_carga > 50 then
		set v_taxa_extra = 15;
		set v_valor_final = v_valor_final + v_taxa_extra;
    else
		set v_taxa_extra = 0;
	end if;
        
	
    -- Inserir na tabela entregas
    insert into entregas (id_pedido, valor_da_distancia, valor_do_peso, acrescimo, desconto, taxa_extra, valor_final, status_entrega) values
    (new.id_pedido, v_valor_distancia, v_valor_peso, v_acrescimo, v_desconto, v_taxa_extra, v_valor_final, 'calculado');
end */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `telefones`
--

DROP TABLE IF EXISTS `telefones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `telefones` (
  `id_telefone` int NOT NULL AUTO_INCREMENT,
  `telefone` varchar(20) NOT NULL,
  `id_cliente` int NOT NULL,
  PRIMARY KEY (`id_telefone`),
  UNIQUE KEY `telefone_UNIQUE` (`telefone`),
  KEY `fk_telefones_clientes1_idx` (`id_cliente`),
  CONSTRAINT `fk_telefones_clientes1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-05 11:03:32
