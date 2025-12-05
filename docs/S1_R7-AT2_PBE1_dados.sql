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
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (10,'Zé Ninguem da Costa','12345678911','zeninguem@gmail.com'),(11,'Zé da Manga','33344455566','zedamanga@gmail.com'),(12,'Zé da Pera','55566677788','zedapera@gmail.com');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `enderecos`
--

LOCK TABLES `enderecos` WRITE;
/*!40000 ALTER TABLE `enderecos` DISABLE KEYS */;
INSERT INTO `enderecos` VALUES (6,10,'13184631','SP','Hortolândia','Parque dos Pinheiros','Rua Acácia','412',''),(7,11,'13184677','SP','Hortolândia','Jardim Minda','Rua Severino José da Silva','4',''),(8,12,'13178610','SP','Sumaré','Conjunto Habitacional Angelo Tomazin','Rua Mário Pinto Agostinho','4','');
/*!40000 ALTER TABLE `enderecos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `entregas`
--

LOCK TABLES `entregas` WRITE;
/*!40000 ALTER TABLE `entregas` DISABLE KEYS */;
INSERT INTO `entregas` VALUES (3,8,20.00,20.00,0.00,0.00,0.00,40.00,'calculado');
/*!40000 ALTER TABLE `entregas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (8,10,6,NULL,'normal',10.00,10.00,2.00,2.00);
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;
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
-- Dumping data for table `telefones`
--

LOCK TABLES `telefones` WRITE;
/*!40000 ALTER TABLE `telefones` DISABLE KEYS */;
INSERT INTO `telefones` VALUES (18,'19987654323',10),(19,'19988888887',10),(20,'19987654343',11),(21,'19988488887',11),(22,'19900000000',10),(23,'19987644343',12),(24,'19988485887',12);
/*!40000 ALTER TABLE `telefones` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-05 11:02:46
