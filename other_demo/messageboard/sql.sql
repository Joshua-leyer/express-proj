/*
SQLyog Ultimate v12.5.1 (64 bit)
MySQL - 8.0.12 : Database - messageboard
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`messageboard` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `messageboard`;

/*Table structure for table `comments` */

DROP TABLE IF EXISTS `comments`;

CREATE TABLE `comments` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `userName` varchar(255) DEFAULT NULL,
  `userImg` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT 'https://res.cptyun.com/res/img/user/default_head.png',
  `title` text,
  `msg` text,
  `date` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

/*Data for the table `comments` */

insert  into `comments`(`id`,`userName`,`userImg`,`title`,`msg`,`date`) values 
(17,'admin','https://res.cptyun.com/res/img/user/default_head.png','红海行动','123456','2020-11-17   16:31:23'),
(16,'test','https://res.cptyun.com/res/img/user/default_head.png','123','123','2020-11-12   09:23:53'),
(15,'南小濡','https://res.cptyun.com/res/img/user/南小濡.jpg','123','我的评论','2020-11-12   09:06:15'),
(18,'admin','https://res.cptyun.com/res/img/user/default_head.png','apache history路由配置','asdasdasd','2020-11-17   16:32:34');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `mail` varchar(255) DEFAULT NULL,
  `pwd` varchar(255) DEFAULT NULL,
  `img` varchar(255) DEFAULT 'https://res.cptyun.com/res/img/user/default_head.png',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `users` */

insert  into `users`(`id`,`name`,`mail`,`pwd`,`img`) values 
(1,'admin','779423249@qq.com','iNNmYF7bXEigJkqpKiMX4g==','https://res.cptyun.com/res/img/user/default_head.png');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
