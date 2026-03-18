-- =============================================
-- 进销价格管理系统数据库脚本
-- 版本: 1.0
-- 日期: 2026-03-18
-- =============================================

-- ----------------------------
-- 1. 供应商表
-- ----------------------------
DROP TABLE IF EXISTS `pms_supplier`;
CREATE TABLE `pms_supplier` (
  `supplier_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '供应商ID',
  `supplier_name` varchar(100) NOT NULL COMMENT '供应商名称',
  `contact_name` varchar(50) DEFAULT NULL COMMENT '联系人',
  `contact_phone` varchar(20) DEFAULT NULL COMMENT '联系电话',
  `contact_email` varchar(100) DEFAULT NULL COMMENT '联系邮箱',
  `address` varchar(500) DEFAULT NULL COMMENT '地址',
  `lead_cycle_days` int(11) DEFAULT 0 COMMENT '供货周期(天)',
  `status` char(1) DEFAULT '0' COMMENT '状态（0正常 1停用）',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`supplier_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='供应商表';

-- ----------------------------
-- 2. 配件类型表
-- ----------------------------
DROP TABLE IF EXISTS `pms_accessory_type`;
CREATE TABLE `pms_accessory_type` (
  `type_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '配件类型ID',
  `type_name` varchar(50) NOT NULL COMMENT '类型名称',
  `type_code` varchar(50) NOT NULL COMMENT '类型代码',
  `sort_order` int(11) DEFAULT 0 COMMENT '排序',
  `is_system` char(1) DEFAULT '0' COMMENT '是否系统预置（0否 1是）',
  `status` char(1) DEFAULT '0' COMMENT '状态（0正常 1停用）',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`type_id`),
  UNIQUE KEY `uk_type_code` (`type_code`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='配件类型表';

-- 初始化配件类型数据
INSERT INTO `pms_accessory_type` (`type_name`, `type_code`, `sort_order`, `is_system`, `status`, `create_time`) VALUES
('内存', 'memory', 1, '1', '0', NOW()),
('硬盘', 'storage', 2, '1', '0', NOW()),
('操作系统', 'os', 3, '1', '0', NOW()),
('屏幕', 'screen', 4, '0', '0', NOW()),
('键盘', 'keyboard', 5, '0', '0', NOW()),
('保修', 'warranty', 6, '0', '0', NOW());

-- ----------------------------
-- 3. 配件规格表
-- ----------------------------
DROP TABLE IF EXISTS `pms_accessory_value`;
CREATE TABLE `pms_accessory_value` (
  `value_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '配件规格ID',
  `type_id` bigint(20) NOT NULL COMMENT '配件类型ID',
  `value_name` varchar(100) NOT NULL COMMENT '规格名称',
  `spec_description` varchar(500) DEFAULT NULL COMMENT '规格描述',
  `price_add_usd` decimal(18,2) DEFAULT 0.00 COMMENT '加价(USD)',
  `sort_order` int(11) DEFAULT 0 COMMENT '排序',
  `status` char(1) DEFAULT '0' COMMENT '状态（0正常 1停用）',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`value_id`),
  KEY `idx_type_id` (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='配件规格表';

-- 初始化配件规格数据
INSERT INTO `pms_accessory_value` (`type_id`, `value_name`, `spec_description`, `price_add_usd`, `sort_order`, `status`, `create_time`) VALUES
-- 内存
(1, '8GB DDR4 3200MHz', '8GB DDR4 3200MHz', 40.00, 1, '0', NOW()),
(1, '16GB DDR4 3200MHz', '16GB DDR4 3200MHz', 70.00, 2, '0', NOW()),
(1, '32GB DDR4 3200MHz', '32GB DDR4 3200MHz', 130.00, 3, '0', NOW()),
(1, '64GB DDR4 3200MHz', '64GB DDR4 3200MHz (2x32GB)', 250.00, 4, '0', NOW()),
-- 硬盘
(2, '256GB NVMe SSD', '256GB NVMe M.2 SSD', 50.00, 1, '0', NOW()),
(2, '512GB NVMe SSD', '512GB NVMe M.2 SSD', 80.00, 2, '0', NOW()),
(2, '1TB NVMe SSD', '1TB NVMe M.2 SSD', 120.00, 3, '0', NOW()),
(2, '2TB NVMe SSD', '2TB NVMe M.2 SSD', 200.00, 4, '0', NOW()),
-- 操作系统
(3, 'Windows 11 Home', 'Windows 11 Home 中文版', 100.00, 1, '0', NOW()),
(3, 'Windows 11 Pro', 'Windows 11 Pro 专业版', 150.00, 2, '0', NOW()),
(3, 'Ubuntu 22.04 LTS', 'Ubuntu 22.04 LTS', 0.00, 3, '0', NOW()),
(3, '无操作系统', '不预装操作系统', 0.00, 4, '0', NOW());

-- ----------------------------
-- 4. 基础型号表 (SPU)
-- ----------------------------
DROP TABLE IF EXISTS `pms_barebone`;
CREATE TABLE `pms_barebone` (
  `barebone_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '基础型号ID',
  `supplier_id` bigint(20) NOT NULL COMMENT '供应商ID',
  `model_name` varchar(100) NOT NULL COMMENT '型号名称',
  `model_code` varchar(50) DEFAULT NULL COMMENT '型号编码',
  `series_name` varchar(100) DEFAULT NULL COMMENT '系列名称',
  `cpu_spec` varchar(200) DEFAULT NULL COMMENT 'CPU规格',
  `screen_spec` varchar(200) DEFAULT NULL COMMENT '屏幕规格',
  `color` varchar(50) DEFAULT NULL COMMENT '颜色',
  `base_price_usd` decimal(18,2) NOT NULL DEFAULT 0.00 COMMENT '基础价格(USD)',
  `status` char(1) DEFAULT '0' COMMENT '状态（0正常 1停用）',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`barebone_id`),
  KEY `idx_supplier_id` (`supplier_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='基础型号表(SPU)';

-- ----------------------------
-- 5. SPU-配件关联表
-- ----------------------------
DROP TABLE IF EXISTS `pms_barebone_accessory`;
CREATE TABLE `pms_barebone_accessory` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `barebone_id` bigint(20) NOT NULL COMMENT '基础型号ID',
  `accessory_type_id` bigint(20) NOT NULL COMMENT '配件类型ID',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_barebone_accessory` (`barebone_id`, `accessory_type_id`),
  KEY `idx_barebone_id` (`barebone_id`),
  KEY `idx_accessory_type_id` (`accessory_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='SPU-配件关联表';

-- ----------------------------
-- 6. SKU表
-- ----------------------------
DROP TABLE IF EXISTS `pms_sku`;
CREATE TABLE `pms_sku` (
  `sku_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'SKU ID',
  `barebone_id` bigint(20) NOT NULL COMMENT '基础型号ID',
  `sku_code` varchar(50) NOT NULL COMMENT 'SKU编码',
  `sku_name` varchar(200) DEFAULT NULL COMMENT 'SKU名称',
  `config_description` varchar(1000) DEFAULT NULL COMMENT '配置描述',
  `total_add_price_usd` decimal(18,2) DEFAULT 0.00 COMMENT '总配件加价(USD)',
  `status` char(1) DEFAULT '0' COMMENT '状态（0正常 1停用）',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`sku_id`),
  UNIQUE KEY `uk_sku_code` (`sku_code`),
  KEY `idx_barebone_id` (`barebone_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='SKU表';

-- ----------------------------
-- 7. SKU配件明细表
-- ----------------------------
DROP TABLE IF EXISTS `pms_sku_accessory`;
CREATE TABLE `pms_sku_accessory` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `sku_id` bigint(20) NOT NULL COMMENT 'SKU ID',
  `accessory_type_id` bigint(20) NOT NULL COMMENT '配件类型ID',
  `accessory_value_id` bigint(20) NOT NULL COMMENT '配件规格ID',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sku_accessory_type` (`sku_id`, `accessory_type_id`),
  KEY `idx_sku_id` (`sku_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='SKU配件明细表';

-- ----------------------------
-- 8. 汇率表
-- ----------------------------
DROP TABLE IF EXISTS `pms_exchange_rate`;
CREATE TABLE `pms_exchange_rate` (
  `rate_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '汇率ID',
  `currency_pair` varchar(20) NOT NULL COMMENT '货币对（如USD/AUD）',
  `rate_value` decimal(18,6) NOT NULL COMMENT '汇率值',
  `effective_date` date NOT NULL COMMENT '生效日期',
  `is_active` char(1) DEFAULT '1' COMMENT '是否当前生效（0否 1是）',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`rate_id`),
  KEY `idx_currency_pair` (`currency_pair`),
  KEY `idx_effective_date` (`effective_date`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='汇率表';

-- 初始化汇率数据
INSERT INTO `pms_exchange_rate` (`currency_pair`, `rate_value`, `effective_date`, `is_active`, `create_time`) VALUES
('USD/AUD', 1.550000, CURDATE(), '1', NOW());

-- ----------------------------
-- 9. 价格主表
-- ----------------------------
DROP TABLE IF EXISTS `pms_price_main`;
CREATE TABLE `pms_price_main` (
  `price_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '价格ID',
  `sku_id` bigint(20) NOT NULL COMMENT 'SKU ID',
  `supplier_base_price_usd` decimal(18,2) DEFAULT 0.00 COMMENT '供应商基础价(USD)',
  `exchange_rate` decimal(18,6) DEFAULT 1.000000 COMMENT '汇率',
  `total_cost_aud` decimal(18,2) DEFAULT 0.00 COMMENT '总成本(AUD)',
  `dbp_ex_aud` decimal(18,2) DEFAULT 0.00 COMMENT '经销商采购价DBP(AUD)',
  `profit_aud` decimal(18,2) DEFAULT 0.00 COMMENT '利润(AUD)',
  `rrp_inc_aud` decimal(18,2) DEFAULT 0.00 COMMENT '建议零售价RRP(AUD)',
  `build_margin` decimal(10,2) DEFAULT 0.00 COMMENT 'Build Margin(%)',
  `rrp_margin` decimal(10,2) DEFAULT 0.00 COMMENT 'RRP Margin(%)',
  `effective_date` date DEFAULT NULL COMMENT '生效日期',
  `version` int(11) DEFAULT 1 COMMENT '版本号',
  `status` char(1) DEFAULT '0' COMMENT '状态（0正常 1停用）',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`price_id`),
  KEY `idx_sku_id` (`sku_id`),
  KEY `idx_effective_date` (`effective_date`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='价格主表';

-- ----------------------------
-- 10. 价格明细表（各项附加费用）
-- ----------------------------
DROP TABLE IF EXISTS `pms_price_detail`;
CREATE TABLE `pms_price_detail` (
  `detail_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '明细ID',
  `price_id` bigint(20) NOT NULL COMMENT '价格ID',
  `fee_type` varchar(50) NOT NULL COMMENT '费用类型',
  `fee_name` varchar(100) DEFAULT NULL COMMENT '费用名称',
  `amount_aud` decimal(18,2) DEFAULT 0.00 COMMENT '金额(AUD)',
  `sort_order` int(11) DEFAULT 0 COMMENT '排序',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`detail_id`),
  KEY `idx_price_id` (`price_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='价格明细表';

-- 初始化费用类型
INSERT INTO `pms_price_detail` (`price_id`, `fee_type`, `fee_name`, `amount_aud`, `sort_order`, `create_time`) VALUES
(0, 'freight_cn', '中国运费', 30.00, 1, NOW()),
(0, 'advertising', '广告费', 10.00, 2, NOW()),
(0, 'build', '组装费', 70.00, 3, NOW()),
(0, 'freight_au', '澳洲运费', 10.00, 4, NOW()),
(0, 'warranty', '保修费', 10.00, 5, NOW());

-- 删除初始化数据（price_id=0是模板）
DELETE FROM `pms_price_detail` WHERE `price_id` = 0;

-- ----------------------------
-- 11. 价格历史表
-- ----------------------------
DROP TABLE IF EXISTS `pms_price_history`;
CREATE TABLE `pms_price_history` (
  `history_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '历史ID',
  `price_id` bigint(20) NOT NULL COMMENT '价格ID',
  `change_type` varchar(20) NOT NULL COMMENT '变更类型（新增/修改）',
  `before_data` text COMMENT '变更前数据(JSON)',
  `after_data` text COMMENT '变更后数据(JSON)',
  `change_reason` varchar(500) DEFAULT NULL COMMENT '变更原因',
  `create_by` varchar(64) DEFAULT '' COMMENT '操作人',
  `create_time` datetime DEFAULT NULL COMMENT '变更时间',
  PRIMARY KEY (`history_id`),
  KEY `idx_price_id` (`price_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='价格历史表';

-- ----------------------------
-- 12. 经销商等级表
-- ----------------------------
DROP TABLE IF EXISTS `pms_distributor_level`;
CREATE TABLE `pms_distributor_level` (
  `level_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '等级ID',
  `level_name` varchar(50) NOT NULL COMMENT '等级名称',
  `level_code` varchar(50) NOT NULL COMMENT '等级代码',
  `discount_rate` decimal(5,2) DEFAULT 100.00 COMMENT '折扣率(%)',
  `visible_dbp` char(1) DEFAULT '1' COMMENT '可见DBP（0否 1是）',
  `visible_rrp` char(1) DEFAULT '1' COMMENT '可见RRP（0否 1是）',
  `priority` int(11) DEFAULT 0 COMMENT '优先级',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`level_id`),
  UNIQUE KEY `uk_level_code` (`level_code`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='经销商等级表';

-- 初始化经销商等级
INSERT INTO `pms_distributor_level` (`level_name`, `level_code`, `discount_rate`, `visible_dbp`, `visible_rrp`, `priority`, `create_time`) VALUES
('金牌经销商', 'gold', 95.00, '1', '1', 1, NOW()),
('银牌经销商', 'silver', 98.00, '1', '1', 2, NOW()),
('普通经销商', 'normal', 100.00, '1', '1', 3, NOW());

-- ----------------------------
-- 13. 经销商表
-- ----------------------------
DROP TABLE IF EXISTS `pms_distributor`;
CREATE TABLE `pms_distributor` (
  `distributor_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '经销商ID',
  `user_id` bigint(20) DEFAULT NULL COMMENT '关联用户ID',
  `level_id` bigint(20) DEFAULT NULL COMMENT '经销商等级ID',
  `company_name` varchar(200) DEFAULT NULL COMMENT '公司名称',
  `contact_name` varchar(50) DEFAULT NULL COMMENT '联系人',
  `contact_phone` varchar(20) DEFAULT NULL COMMENT '联系电话',
  `contact_email` varchar(100) DEFAULT NULL COMMENT '联系邮箱',
  `address` varchar(500) DEFAULT NULL COMMENT '地址',
  `credit_limit` decimal(18,2) DEFAULT 0.00 COMMENT '信用额度',
  `status` char(1) DEFAULT '0' COMMENT '状态（0正常 1停用）',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`distributor_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_level_id` (`level_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='经销商表';

-- ----------------------------
-- 14. 导入记录表
-- ----------------------------
DROP TABLE IF EXISTS `pms_import_record`;
CREATE TABLE `pms_import_record` (
  `record_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `import_type` varchar(20) NOT NULL COMMENT '导入类型（SPU/SKU）',
  `file_name` varchar(200) DEFAULT NULL COMMENT '文件名',
  `file_type` varchar(20) DEFAULT NULL COMMENT '文件类型',
  `total_count` int(11) DEFAULT 0 COMMENT '总数量',
  `success_count` int(11) DEFAULT 0 COMMENT '成功数量',
  `fail_count` int(11) DEFAULT 0 COMMENT '失败数量',
  `status` char(1) DEFAULT '0' COMMENT '状态（0处理中 1成功 2部分成功 3失败）',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_by` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`record_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='导入记录表';

-- ----------------------------
-- 15. 导入明细表
-- ----------------------------
DROP TABLE IF EXISTS `pms_import_detail`;
CREATE TABLE `pms_import_detail` (
  `detail_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '明细ID',
  `record_id` bigint(20) NOT NULL COMMENT '记录ID',
  `row_number` int(11) DEFAULT NULL COMMENT '行号',
  `row_data` text COMMENT '行数据(JSON)',
  `parse_status` char(1) DEFAULT '0' COMMENT '解析状态（0待处理 1成功 2失败）',
  `error_message` varchar(500) DEFAULT NULL COMMENT '错误信息',
  `is_confirmed` char(1) DEFAULT '0' COMMENT '是否已确认（0否 1是）',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`detail_id`),
  KEY `idx_record_id` (`record_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='导入明细表';

-- ----------------------------
-- 菜单数据
-- ----------------------------
-- 一级菜单：采购销售管理
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `route_name`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`, `remark`) VALUES
('采购销售管理', 0, 5, 'pms', NULL, NULL, '', 1, 0, 'M', '0', '0', '', 'shopping', 'admin', NOW(), '采购销售管理目录');

SET @pms_menu_id = LAST_INSERT_ID();

-- 二级菜单
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `route_name`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`) VALUES
('供应商管理', @pms_menu_id, 1, 'supplier', 'pms/supplier/index', NULL, '', 1, 0, 'C', '0', '0', 'pms:supplier:list', 'peoples', 'admin', NOW()),
('基础型号管理', @pms_menu_id, 2, 'barebone', 'pms/barebone/index', NULL, '', 1, 0, 'C', '0', '0', 'pms:barebone:list', 'component', 'admin', NOW()),
('配件管理', @pms_menu_id, 3, 'accessory', 'pms/accessory/index', NULL, '', 1, 0, 'C', '0', '0', 'pms:accessory:list', 'build', 'admin', NOW()),
('SKU管理', @pms_menu_id, 4, 'sku', 'pms/sku/index', NULL, '', 1, 0, 'C', '0', '0', 'pms:sku:list', 'list', 'admin', NOW()),
('价格管理', @pms_menu_id, 5, 'price', 'pms/price/index', NULL, '', 1, 0, 'C', '0', '0', 'pms:price:list', 'money', 'admin', NOW()),
('汇率管理', @pms_menu_id, 6, 'rate', 'pms/rate/index', NULL, '', 1, 0, 'C', '0', '0', 'pms:rate:list', 'rate', 'admin', NOW()),
('经销商管理', @pms_menu_id, 7, 'distributor', 'pms/distributor/index', NULL, '', 1, 0, 'C', '0', '0', 'pms:distributor:list', 'user', 'admin', NOW()),
('产品比对', @pms_menu_id, 8, 'compare', 'pms/compare/index', NULL, '', 1, 0, 'C', '0', '0', 'pms:compare:list', 'contrast', 'admin', NOW()),
('数据导入', @pms_menu_id, 9, 'import', 'pms/import/index', NULL, '', 1, 0, 'C', '0', '0', 'pms:import:list', 'upload', 'admin', NOW());

-- 获取各二级菜单ID
SET @supplier_menu_id = (SELECT menu_id FROM sys_menu WHERE menu_name = '供应商管理' AND parent_id = @pms_menu_id);
SET @barebone_menu_id = (SELECT menu_id FROM sys_menu WHERE menu_name = '基础型号管理' AND parent_id = @pms_menu_id);
SET @accessory_menu_id = (SELECT menu_id FROM sys_menu WHERE menu_name = '配件管理' AND parent_id = @pms_menu_id);
SET @sku_menu_id = (SELECT menu_id FROM sys_menu WHERE menu_name = 'SKU管理' AND parent_id = @pms_menu_id);
SET @price_menu_id = (SELECT menu_id FROM sys_menu WHERE menu_name = '价格管理' AND parent_id = @pms_menu_id);
SET @rate_menu_id = (SELECT menu_id FROM sys_menu WHERE menu_name = '汇率管理' AND parent_id = @pms_menu_id);
SET @distributor_menu_id = (SELECT menu_id FROM sys_menu WHERE menu_name = '经销商管理' AND parent_id = @pms_menu_id);
SET @compare_menu_id = (SELECT menu_id FROM sys_menu WHERE menu_name = '产品比对' AND parent_id = @pms_menu_id);
SET @import_menu_id = (SELECT menu_id FROM sys_menu WHERE menu_name = '数据导入' AND parent_id = @pms_menu_id);

-- 供应商管理按钮
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `route_name`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`) VALUES
('供应商查询', @supplier_menu_id, 1, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:supplier:query', '#', 'admin', NOW()),
('供应商新增', @supplier_menu_id, 2, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:supplier:add', '#', 'admin', NOW()),
('供应商修改', @supplier_menu_id, 3, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:supplier:edit', '#', 'admin', NOW()),
('供应商删除', @supplier_menu_id, 4, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:supplier:remove', '#', 'admin', NOW()),
('供应商导出', @supplier_menu_id, 5, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:supplier:export', '#', 'admin', NOW());

-- 基础型号管理按钮
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `route_name`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`) VALUES
('型号查询', @barebone_menu_id, 1, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:barebone:query', '#', 'admin', NOW()),
('型号新增', @barebone_menu_id, 2, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:barebone:add', '#', 'admin', NOW()),
('型号修改', @barebone_menu_id, 3, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:barebone:edit', '#', 'admin', NOW()),
('型号删除', @barebone_menu_id, 4, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:barebone:remove', '#', 'admin', NOW()),
('型号导出', @barebone_menu_id, 5, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:barebone:export', '#', 'admin', NOW());

-- 配件管理按钮
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `route_name`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`) VALUES
('配件查询', @accessory_menu_id, 1, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:accessory:query', '#', 'admin', NOW()),
('配件新增', @accessory_menu_id, 2, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:accessory:add', '#', 'admin', NOW()),
('配件修改', @accessory_menu_id, 3, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:accessory:edit', '#', 'admin', NOW()),
('配件删除', @accessory_menu_id, 4, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:accessory:remove', '#', 'admin', NOW()),
('配件导出', @accessory_menu_id, 5, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:accessory:export', '#', 'admin', NOW());

-- SKU管理按钮
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `route_name`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`) VALUES
('SKU查询', @sku_menu_id, 1, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:sku:query', '#', 'admin', NOW()),
('SKU新增', @sku_menu_id, 2, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:sku:add', '#', 'admin', NOW()),
('SKU修改', @sku_menu_id, 3, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:sku:edit', '#', 'admin', NOW()),
('SKU删除', @sku_menu_id, 4, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:sku:remove', '#', 'admin', NOW()),
('SKU导出', @sku_menu_id, 5, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:sku:export', '#', 'admin', NOW());

-- 价格管理按钮
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `route_name`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`) VALUES
('价格查询', @price_menu_id, 1, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:price:query', '#', 'admin', NOW()),
('价格新增', @price_menu_id, 2, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:price:add', '#', 'admin', NOW()),
('价格修改', @price_menu_id, 3, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:price:edit', '#', 'admin', NOW()),
('价格删除', @price_menu_id, 4, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:price:remove', '#', 'admin', NOW()),
('价格导出', @price_menu_id, 5, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:price:export', '#', 'admin', NOW()),
('价格历史', @price_menu_id, 6, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:price:history', '#', 'admin', NOW());

-- 汇率管理按钮
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `route_name`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`) VALUES
('汇率查询', @rate_menu_id, 1, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:rate:query', '#', 'admin', NOW()),
('汇率新增', @rate_menu_id, 2, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:rate:add', '#', 'admin', NOW()),
('汇率修改', @rate_menu_id, 3, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:rate:edit', '#', 'admin', NOW()),
('汇率删除', @rate_menu_id, 4, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:rate:remove', '#', 'admin', NOW());

-- 经销商管理按钮
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `route_name`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`) VALUES
('经销商查询', @distributor_menu_id, 1, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:distributor:query', '#', 'admin', NOW()),
('经销商新增', @distributor_menu_id, 2, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:distributor:add', '#', 'admin', NOW()),
('经销商修改', @distributor_menu_id, 3, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:distributor:edit', '#', 'admin', NOW()),
('经销商删除', @distributor_menu_id, 4, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:distributor:remove', '#', 'admin', NOW()),
('经销商导出', @distributor_menu_id, 5, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:distributor:export', '#', 'admin', NOW());

-- 产品比对按钮
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `route_name`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`) VALUES
('SPU比对', @compare_menu_id, 1, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:compare:spu', '#', 'admin', NOW()),
('SKU比对', @compare_menu_id, 2, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:compare:sku', '#', 'admin', NOW()),
('比对导出', @compare_menu_id, 3, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:compare:export', '#', 'admin', NOW());

-- 数据导入按钮
INSERT INTO `sys_menu` (`menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `route_name`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`) VALUES
('上传文件', @import_menu_id, 1, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:import:upload', '#', 'admin', NOW()),
('预览数据', @import_menu_id, 2, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:import:preview', '#', 'admin', NOW()),
('确认入库', @import_menu_id, 3, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:import:confirm', '#', 'admin', NOW()),
('下载模板', @import_menu_id, 4, '', NULL, NULL, '', 1, 0, 'F', '0', '0', 'pms:import:template', '#', 'admin', NOW());