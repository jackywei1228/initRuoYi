package com.ruoyi.system.pms.domain;

import java.math.BigDecimal;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 基础型号(SPU)表 pms_barebone
 *
 * @author ruoyi
 */
public class PmsBarebone extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 基础型号ID */
    private Long bareboneId;

    /** 供应商ID */
    private Long supplierId;

    /** 型号名称 */
    private String modelName;

    /** 系列名称 */
    private String seriesName;

    /** CPU规格 */
    private String cpuSpec;

    /** 屏幕规格 */
    private String screenSpec;

    /** 颜色 */
    private String color;

    /** 基础价格(USD) */
    private BigDecimal basePriceUsd;

    /** 状态（0正常 1停用） */
    private String status;

    public Long getBareboneId()
    {
        return bareboneId;
    }

    public void setBareboneId(Long bareboneId)
    {
        this.bareboneId = bareboneId;
    }

    public Long getSupplierId()
    {
        return supplierId;
    }

    public void setSupplierId(Long supplierId)
    {
        this.supplierId = supplierId;
    }

    public String getModelName()
    {
        return modelName;
    }

    public void setModelName(String modelName)
    {
        this.modelName = modelName;
    }

    public String getSeriesName()
    {
        return seriesName;
    }

    public void setSeriesName(String seriesName)
    {
        this.seriesName = seriesName;
    }

    public String getCpuSpec()
    {
        return cpuSpec;
    }

    public void setCpuSpec(String cpuSpec)
    {
        this.cpuSpec = cpuSpec;
    }

    public String getScreenSpec()
    {
        return screenSpec;
    }

    public void setScreenSpec(String screenSpec)
    {
        this.screenSpec = screenSpec;
    }

    public String getColor()
    {
        return color;
    }

    public void setColor(String color)
    {
        this.color = color;
    }

    public BigDecimal getBasePriceUsd()
    {
        return basePriceUsd;
    }

    public void setBasePriceUsd(BigDecimal basePriceUsd)
    {
        this.basePriceUsd = basePriceUsd;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }

    @Override
    public String toString()
    {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("bareboneId", getBareboneId())
            .append("supplierId", getSupplierId())
            .append("modelName", getModelName())
            .append("seriesName", getSeriesName())
            .append("cpuSpec", getCpuSpec())
            .append("screenSpec", getScreenSpec())
            .append("color", getColor())
            .append("basePriceUsd", getBasePriceUsd())
            .append("status", getStatus())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .append("remark", getRemark())
            .toString();
    }
}