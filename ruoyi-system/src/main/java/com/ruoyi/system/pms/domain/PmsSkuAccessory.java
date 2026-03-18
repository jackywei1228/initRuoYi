package com.ruoyi.system.pms.domain;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import java.io.Serializable;

/**
 * SKU配件关联表 pms_sku_accessory
 *
 * @author ruoyi
 */
public class PmsSkuAccessory implements Serializable
{
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    private Long id;

    /** SKU ID */
    private Long skuId;

    /** 配件类型ID */
    private Long accessoryTypeId;

    /** 配件值ID */
    private Long accessoryValueId;

    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public Long getSkuId()
    {
        return skuId;
    }

    public void setSkuId(Long skuId)
    {
        this.skuId = skuId;
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

    @Override
    public String toString()
    {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("id", getId())
            .append("skuId", getSkuId())
            .append("accessoryTypeId", getAccessoryTypeId())
            .append("accessoryValueId", getAccessoryValueId())
            .toString();
    }
}