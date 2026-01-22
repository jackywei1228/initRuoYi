package com.ruoyi.system.service.impl;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.system.domain.SysI18n;
import com.ruoyi.system.mapper.SysI18nMapper;
import com.ruoyi.system.service.ISysI18nService;

/**
 * 国际化资源 服务层实现
 */
@Service
public class SysI18nServiceImpl implements ISysI18nService
{
    private static final String STATUS_ENABLED = "0";

    @Autowired
    private SysI18nMapper sysI18nMapper;

    @Override
    public Map<String, String> selectI18nMap(String lang)
    {
        List<SysI18n> list = sysI18nMapper.selectI18nByLang(lang, STATUS_ENABLED);
        Map<String, String> map = new LinkedHashMap<>();
        for (SysI18n item : list)
        {
            map.put(item.getI18nKey(), item.getI18nValue());
        }
        return map;
    }
}
