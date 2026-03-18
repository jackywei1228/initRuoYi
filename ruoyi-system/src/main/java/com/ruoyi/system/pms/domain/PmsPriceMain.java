package com.ruoyi.system.pms.domain;

import java.math.BigDecimal;
import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 价格主数据表 pms_price_main
 *
 * @author ruoyi
 */
public class PmsPriceMain extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 价格ID */
    private Long priceId;

    /** SKU ID */
    private Long skuId;

    /** 供应商基础价格(USD) */
    private BigDecimal supplierBasePriceUsd;

    /** 汇率(USD/AUD) */
    private BigDecimal exchangeRateUsdAud;

    /** 总成本(AUD) */
    private BigDecimal totalCostAud;

    /** 经销商价格不含税(AUD) */
    private BigDecimal dbpExAud;

    /** 利润(AUD) */
    private BigDecimal profitAud;

    /** 建议零售价含税(AUD) */
    private BigDecimal rrpIncAud;

    /** 建造利润率 */
    private BigDecimal buildMargin;

    /** RRP利润率 */
    private BigDecimal rrpMargin;

    /** 生效日期 */
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date effectiveDate;

    /** 版本号 */
    private Integer version;

    /** 状态（0正常 1停用） */
    private String status;

    /** SKU编码（关联查询） */
    private String skuCode;

    /** 配置描述（关联查询） */
    private String configDescription;

    /** 型号名称（关联查询） */
    private String modelName;

    /** 供应商名称（关联查询） */
    private String supplierName;

    public Long getPriceId()
    {
        return priceId;
    }

    public void setPriceId(Long priceId)
    {
        this.priceId = priceId;
    }

    public Long getSkuId()
    {
        return skuId;
    }

    public void setSkuId(Long skuId)
    {
        this.skuId = skuId;
    }

    public BigDecimal getSupplierBasePriceUsd()
    {
        return supplierBasePriceUsd;
    }

    public void setSupplierBasePriceUsd(BigDecimal supplierBasePriceUsd)
    {
        this.supplierBasePriceUsd = supplierBasePriceUsd;
    }

    public BigDecimal getExchangeRateUsdAud()
    {
        return exchangeRateUsdAud;
    }

    public void setExchangeRateUsdAud(BigDecimal exchangeRateUsdAud)
    {
        this.exchangeRateUsdAud = exchangeRateUsdAud;
    }

    public BigDecimal getTotalCostAud()
    {
        return totalCostAud;
    }

    public void setTotalCostAud(BigDecimal totalCostAud)
    {
        this.totalCostAud = totalCostAud;
    }

    public BigDecimal getDbpExAud()
    {
        return dbpExAud;
    }

    public void setDbpExAud(BigDecimal dbpExAud)
    {
        this.dbpExAud = dbpExAud;
    }

    public BigDecimal getProfitAud()
    {
        return profitAud;
    }

    public void setProfitAud(BigDecimal profitAud)
    {
        this.profitAud = profitAud;
    }

    public BigDecimal getRrpIncAud()
    {
        return rrpIncAud;
    }

    public void setRrpIncAud(BigDecimal rrpIncAud)
    {
        this.rrpIncAud = rrpIncAud;
    }

    public BigDecimal getBuildMargin()
    {
        return buildMargin;
    }

    public void setBuildMargin(BigDecimal buildMargin)
    {
        this.buildMargin = buildMargin;
    }

    public BigDecimal getRrpMargin()
    {
        return rrpMargin;
    }

    public void setRrpMargin(BigDecimal rrpMargin)
    {
        this.rrpMargin = rrpMargin;
    }

    public Date getEffectiveDate()
    {
        return effectiveDate;
    }

    public void setEffectiveDate(Date effectiveDate)
    {
        this.effectiveDate = effectiveDate;
    }

    public Integer getVersion()
    {
        return version;
    }

    public void setVersion(Integer version)
    {
        this.version = version;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
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

    public String getModelName()
    {
        return modelName;
    }

    public void setModelName(String modelName)
    {
        this.modelName = modelName;
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
            .append("priceId", getPriceId())
            .append("skuId", getSkuId())
            .append("supplierBasePriceUsd", getSupplierBasePriceUsd())
            .append("exchangeRateUsdAud", getExchangeRateUsdAud())
            .append("totalCostAud", getTotalCostAud())
            .append("dbpExAud", getDbpExAud())
            .append("profitAud", getProfitAud())
            .append("rrpIncAud", getRrpIncAud())
            .append("buildMargin", getBuildMargin())
            .append("rrpMargin", getRrpMargin())
            .append("effectiveDate", getEffectiveDate())
            .append("version", getVersion())
            .append("status", getStatus())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .toString();
    }
}