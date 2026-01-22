package com.ruoyi.system.domain;

import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 国际化资源表 sys_i18n
 */
public class SysI18n extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    private Long i18nId;
    private String i18nKey;
    private String lang;
    private String i18nValue;
    private String module;
    private String status;

    public Long getI18nId()
    {
        return i18nId;
    }

    public void setI18nId(Long i18nId)
    {
        this.i18nId = i18nId;
    }

    public String getI18nKey()
    {
        return i18nKey;
    }

    public void setI18nKey(String i18nKey)
    {
        this.i18nKey = i18nKey;
    }

    public String getLang()
    {
        return lang;
    }

    public void setLang(String lang)
    {
        this.lang = lang;
    }

    public String getI18nValue()
    {
        return i18nValue;
    }

    public void setI18nValue(String i18nValue)
    {
        this.i18nValue = i18nValue;
    }

    public String getModule()
    {
        return module;
    }

    public void setModule(String module)
    {
        this.module = module;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }
}
