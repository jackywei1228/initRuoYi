package com.ruoyi.system.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Param;
import com.ruoyi.system.domain.SysI18n;

/**
 * 国际化资源 数据层
 */
public interface SysI18nMapper
{
    public List<SysI18n> selectI18nByLang(@Param("lang") String lang, @Param("status") String status);
}
