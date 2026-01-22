package com.ruoyi.system.service;

import java.util.Map;

/**
 * 国际化资源 服务层
 */
public interface ISysI18nService
{
    Map<String, String> selectI18nMap(String lang);
}
