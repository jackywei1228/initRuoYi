package com.ruoyi.system.pms.domain;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import java.io.Serializable;

/**
 * SPU配件关联表 pms_barebone_accessory
 *
 * @author ruoyi
 */
public class PmsBareboneAccessory implements Serializable
{
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    private Long id;

    /** 基础型号ID */
    private Long bareboneId;

    /** 配件类型ID */
    private Long accessoryTypeId;

    /** 配件值ID */
    private Long accessoryValueId;

    /** 是否默认（0否 1是） */
    private String isDefault;

    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public Long getBareboneId()
    {
        return bareboneId;
    }

    public void setBareboneId(Long bareboneId)
    {
        this.bareboneId = bareboneId;
    }

    public Long getAccessoryTypeId()
    {
        return accessoryTypeId;
    }

    public void setAccessoryTypeId(Long accessoryTypeId)
    {
        this.accessoryTypeId = accessoryTypeId;
    }

    public Long getAccessoryValueId()
    {
        return accessoryValueId;
    }

    public void setAccessoryValueId(Long accessoryValueId)
    {
        this.accessoryValueId = accessoryValueId;
    }

    public String getIsDefault()
    {
        return isDefault;
    }

    public void setIsDefault(String isDefault)
    {
        this.isDefault = isDefault;
    }

    @Override
    public String toString()
    {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("id", getId())
            .append("bareboneId", getBareboneId())
            .append("accessoryTypeId", getAccessoryTypeId())
            .append("accessoryValueId", getAccessoryValueId())
            .append("isDefault", getIsDefault())
            .toString();
    }
}