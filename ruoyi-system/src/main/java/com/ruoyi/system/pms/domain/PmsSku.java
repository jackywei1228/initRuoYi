package com.ruoyi.system.pms.domain;

import java.math.BigDecimal;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * SKU表 pms_sku
 *
 * @author ruoyi
 */
public class PmsSku extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** SKU ID */
    private Long skuId;

    /** 基础型号ID */
    private Long bareboneId;

    /** SKU编码 */
    private String skuCode;

    /** 配置描述 */
    private String configDescription;

    /** 总加价金额(USD) */
    private BigDecimal totalAddPriceUsd;

    /** 状态（0正常 1停用） */
    private String status;

    /** 型号名称（关联查询） */
    private String modelName;

    /** 供应商ID（关联查询） */
    private Long supplierId;

    /** 供应商名称（关联查询） */
    private String supplierName;

    public Long getSkuId()
    {
        return skuId;
    }

    public void setSkuId(Long skuId)
    {
        this.skuId = skuId;
    }

    public Long getBareboneId()
    {
        return bareboneId;
    }

    public void setBareboneId(Long bareboneId)
    {
        this.bareboneId = bareboneId;
    }

    public String getSkuCode()
    {
        return skuCode;
    }

    public void setSkuCode(String skuCode)
    {
        this.skuCode = skuCode;
    }

    public String getConfigDescription()
    {
        return configDescription;
    }

    public void setConfigDescription(String configDescription)
    {
        this.configDescription = configDescription;
    }

    public BigDecimal getTotalAddPriceUsd()
    {
        return totalAddPriceUsd;
    }

    public void setTotalAddPriceUsd(BigDecimal totalAddPriceUsd)
    {
        this.totalAddPriceUsd = totalAddPriceUsd;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }

    public String getModelName()
    {
        return modelName;
    }

    public void setModelName(String modelName)
    {
        this.modelName = modelName;
    }

    public Long getSupplierId()
    {
        return supplierId;
    }

    public void setSupplierId(Long supplierId)
    {
        this.supplierId = supplierId;
    }

    public String getSupplierName()
    {
        return supplierName;
    }

    public void setSupplierName(String supplierName)
    {
        this.supplierName = supplierName;
    }

    @Override
    public String toString()
    {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("skuId", getSkuId())
            .append("bareboneId", getBareboneId())
            .append("skuCode", getSkuCode())
            .append("configDescription", getConfigDescription())
            .append("totalAddPriceUsd", getTotalAddPriceUsd())
            .append("status", getStatus())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .append("remark", getRemark())
            .toString();
    }
}