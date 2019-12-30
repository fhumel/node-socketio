npm install

npm start


config db

create db server

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `server`
--
CREATE DATABASE IF NOT EXISTS `server` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `server`;

-- --------------------------------------------------------

--
-- Estrutura da tabela `employees`
--

DROP TABLE IF EXISTS `employees`;
CREATE TABLE `employees` (
  `ID` int(11) NOT NULL,
  `employee` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--
