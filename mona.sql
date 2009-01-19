-- phpMyAdmin SQL Dump
-- version 2.11.6
-- http://www.phpmyadmin.net
--
-- Serveur: localhost
-- Généré le : Mar 04 Novembre 2008 à 08:25
-- Version du serveur: 5.0.51
-- Version de PHP: 5.2.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `mona`
--

-- --------------------------------------------------------

--
-- Structure de la table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(10) NOT NULL auto_increment,
  `bank` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` int(10) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Contenu de la table `accounts`
--


-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `father_id` int(10) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `color` varchar(6) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=202 ;

--
-- Contenu de la table `categories`
--

INSERT INTO `categories` (`id`, `father_id`, `name`, `color`) VALUES
(1, 0, 'Alimentation', ''),
(82, 5, 'Assurance', '#20302'),
(5, 0, 'Logement', ''),
(6, 5, 'Loyer', ''),
(75, 72, 'MÃ©tro', '#20302'),
(89, 0, 'Communications', '#20302'),
(90, 89, 'TÃ©lÃ©phone portable', '#20302'),
(91, 89, 'Internet', '#20302'),
(92, 0, 'Equipements', '#20302'),
(93, 86, 'CinÃ©ma', '#20302'),
(88, 87, 'David', '#20302'),
(87, 0, 'Habillement', '#20302'),
(86, 0, 'Loisirs et Culture', '#20302'),
(85, 83, 'MÃ©decin', '#20302'),
(84, 83, 'Pharmacie', '#20302'),
(79, 76, 'Assurance', '#20302'),
(78, 76, 'Entretien', '#20302'),
(77, 76, 'Essence', '#20302'),
(74, 72, 'Train', '#20302'),
(76, 72, 'Voiture', '#20302'),
(80, 1, 'Courses', '#20302'),
(72, 0, 'Transport', '#20302'),
(83, 0, 'SantÃ©', '#20302'),
(70, 1, 'Restaurant', '#20302'),
(94, 86, 'Vacances', '#20302'),
(95, 86, 'Informatique', '#20302'),
(185, 184, 'dd', '#20302'),
(201, 87, 'Jie', '#20302');

-- --------------------------------------------------------

--
-- Structure de la table `operation-category`
--

CREATE TABLE `operation-category` (
  `operation_id` int(10) unsigned NOT NULL auto_increment,
  `category_id` int(10) unsigned NOT NULL,
  `value` int(10) NOT NULL,
  PRIMARY KEY  (`operation_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=82 ;

--
-- Contenu de la table `operation-category`
--

INSERT INTO `operation-category` (`operation_id`, `category_id`, `value`) VALUES
(12, 12, 12),
(57, 6, 15),
(72, 1, 12),
(78, 5, 12),
(79, 2, 50),
(80, 6, 45),
(81, 2, 34);

-- --------------------------------------------------------

--
-- Structure de la table `operations`
--

CREATE TABLE `operations` (
  `id` int(10) NOT NULL auto_increment,
  `date` date NOT NULL,
  `value` int(10) NOT NULL,
  `description` varchar(255) NOT NULL,
  `account` int(10) NOT NULL,
  `recurring` int(10) NOT NULL,
  `confirm` enum('true','false') NOT NULL,
  `who_id` int(10) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=82 ;

--
-- Contenu de la table `operations`
--

INSERT INTO `operations` (`id`, `date`, `value`, `description`, `account`, `recurring`, `confirm`, `who_id`) VALUES
(1, '2008-09-13', 100, 'test', 1, 0, 'true', 0),
(2, '2008-09-14', -123, 'depense', 2, 2, 'false', 0),
(52, '2008-10-15', 10, '', 0, 0, '', 0),
(54, '2008-10-17', 15, '', 0, 0, '', 0),
(55, '2008-10-15', 150, '', 0, 0, '', 0),
(29, '0000-00-00', 0, '', 0, 0, '', 0),
(34, '0000-00-00', 0, '', 0, 0, '', 0),
(35, '0000-00-00', 0, '', 0, 0, '', 0),
(51, '2008-10-15', 10, '', 0, 0, '', 0),
(38, '0000-00-00', 1, '', 0, 0, '', 0),
(50, '2008-10-07', 11, '', 0, 0, '', 0),
(53, '2008-10-15', 45, '', 0, 0, '', 0),
(56, '2008-10-15', 150, '', 0, 0, '', 0),
(57, '2008-10-15', 15, '', 0, 0, '', 0),
(58, '2008-10-15', 15, '', 0, 0, '', 0),
(59, '2008-10-15', 15, '', 0, 0, '', 0),
(60, '2008-10-15', 15, '', 0, 0, '', 0),
(61, '2008-10-15', 15, '', 0, 0, '', 0),
(62, '2008-10-15', 15, '', 0, 0, '', 0),
(63, '2008-10-15', 15, '', 0, 0, '', 0),
(64, '2008-10-15', 15, '', 0, 0, '', 0),
(65, '2008-10-15', 15, '', 0, 0, '', 0),
(66, '2008-10-15', 15, '', 0, 0, '', 0),
(67, '2008-10-15', 15, '', 0, 0, '', 0),
(68, '2008-10-15', 15, '', 0, 0, '', 0),
(69, '2008-10-15', 15, '', 0, 0, '', 0),
(70, '2008-10-15', 15, '', 0, 0, '', 0),
(72, '2008-10-07', 12, '', 0, 0, '', 0),
(73, '2008-10-07', 12, '', 0, 0, '', 0),
(74, '2008-10-07', 12, '', 0, 0, '', 0),
(75, '2008-10-07', 12, '', 0, 0, '', 0),
(76, '2008-10-07', 12, '', 0, 0, '', 0),
(77, '2008-10-07', 12, '', 0, 0, '', 0),
(78, '2008-10-07', 12, '', 0, 0, '', 0),
(79, '2008-10-18', 50, '', 0, 0, '', 0),
(80, '2008-10-18', 45, '', 0, 0, '', 0),
(81, '2008-10-07', 34, '', 0, 0, '', 0);

-- --------------------------------------------------------

--
-- Structure de la table `periods`
--

CREATE TABLE `periods` (
  `id` int(10) NOT NULL auto_increment,
  `day` smallint(5) NOT NULL,
  `month` smallint(5) NOT NULL,
  `next` datetime NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Contenu de la table `periods`
--


-- --------------------------------------------------------

--
-- Structure de la table `tag-operation`
--

CREATE TABLE `tag-operation` (
  `tag_id` int(10) NOT NULL,
  `operation_id` int(10) NOT NULL,
  PRIMARY KEY  (`tag_id`,`operation_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Contenu de la table `tag-operation`
--


-- --------------------------------------------------------

--
-- Structure de la table `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Contenu de la table `tags`
--


-- --------------------------------------------------------

--
-- Structure de la table `who`
--

CREATE TABLE `who` (
  `id` int(10) NOT NULL auto_increment,
  `name` varchar(25) NOT NULL,
  `color` varchar(7) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Contenu de la table `who`
--

INSERT INTO `who` (`id`, `name`, `color`) VALUES
(1, 'Carrefour', ''),
(2, 'Leader-Price', ''),
(3, 'SFR', ''),
(4, 'Tisseo', '');
