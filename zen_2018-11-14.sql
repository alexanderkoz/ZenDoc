# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.23)
# Database: zen
# Generation Time: 2018-11-14 16:54:23 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table complaints
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users_application`;

CREATE TABLE `users_application` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `account_type` varchar(10) DEFAULT NULL,
  `whyOU` varchar(255) DEFAULT NULL,
	`image_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `complaints`;

CREATE TABLE `complaints` (
  `comp_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `comment_text` varchar(255) DEFAULT NULL,
  `doc_id` int(11) unsigned DEFAULT NULL,
  `user_id` int(11) unsigned DEFAULT NULL,
	`complaint_type` varchar(10) DEFAULT '',
	`file_name` varchar(255) DEFAULT '',
  PRIMARY KEY (`comp_id`),
  KEY `compldocid` (`doc_id`),
	KEY `compluserid` (`user_id`),
  CONSTRAINT `compldocid` FOREIGN KEY (`doc_id`) REFERENCES `documents` (`doc_id`),
	CONSTRAINT `compluserid` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `complaints` WRITE;
/*!40000 ALTER TABLE `complaints` DISABLE KEYS */;

INSERT INTO `complaints` (`comp_id`, `comment_text`, `doc_id`)
VALUES
	(1,'bad grammar',1);

/*!40000 ALTER TABLE `complaints` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table documents
# ------------------------------------------------------------

DROP TABLE IF EXISTS `documents`;

CREATE TABLE `documents` (
  `doc_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `file_path` varchar(255) NOT NULL DEFAULT '',
  `file_name` varchar(255) DEFAULT '',
  `locked` int(1) DEFAULT 0,
	`shared` int(1) DEFAULT 0,
  PRIMARY KEY (`doc_id`),
  KEY `docrefuid` (`user_id`),
  CONSTRAINT `docrefuid` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;

INSERT INTO `documents` (`doc_id`, `user_id`, `file_path`, `file_name`)
VALUES
	(1,0,'test','test'),
	(2,1,'test_jane.rtf','test_jane'),
	(3,0,'test_john.rtf','test_john');

/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table history_doc
# ------------------------------------------------------------

DROP TABLE IF EXISTS `history_doc`;

CREATE TABLE `history_doc` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `doc_id` int(11) unsigned NOT NULL,
  `date_time` datetime NOT NULL,
  `version` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `hdocid` (`doc_id`),
  CONSTRAINT `hdocid` FOREIGN KEY (`doc_id`) REFERENCES `documents` (`doc_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table suggestions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `suggestions`;

CREATE TABLE `suggestions` (
  `sug_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `taboo_word` varchar(255) NOT NULL DEFAULT '',
  `date` date DEFAULT NULL,
  `doc_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`sug_id`),
  KEY `consusgid` (`user_id`),
  KEY `sugdocid` (`doc_id`),
  CONSTRAINT `consusgid` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sugdocid` FOREIGN KEY (`doc_id`) REFERENCES `documents` (`doc_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table taboo_words
# ------------------------------------------------------------

DROP TABLE IF EXISTS `taboo_words`;

CREATE TABLE `taboo_words` (
  `taboo_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `word` varchar(255) NOT NULL DEFAULT '',
  `user_id` int(11) unsigned DEFAULT NULL,
  `doc_id` int(11) unsigned NOT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`taboo_id`),
  KEY `twdid` (`doc_id`),
  KEY `twuid` (`user_id`),
  CONSTRAINT `twdid` FOREIGN KEY (`doc_id`) REFERENCES `documents` (`doc_id`),
  CONSTRAINT `twuid` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
	`account_type` varchar(10) DEFAULT NULL,
  `whyOU` varchar(255) NOT NULL,
	`image_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `username`, `password`)
VALUES
	(0,'John','Smith','smith@mail.com','jsmith','1234'),
	(1,'Jane','Smith','jane@mail.com','jane','4567');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
