package com.ruoyi.system.pms.domain;

import java.math.BigDecimal;
import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 汇率表 pms_exchange_rate
 *
 * @author ruoyi
 */
public class PmsExchangeRate extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 汇率ID */
    private Long rateId;

    /** 货币对 */
    private String currencyPair;

    /** 汇率值 */
    private BigDecimal rateValue;

    /** 生效日期 */
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date effectiveDate;

    /** 是否启用（0否 1是） */
    private String isActive;

    public Long getRateId()
    {
        return rateId;
    }

    public void setRateId(Long rateId)
    {
        this.rateId = rateId;
    }

    public String getCurrencyPair()
    {
        return currencyPair;
    }

    public void setCurrencyPair(String currencyPair)
    {
        this.currencyPair = currencyPair;
    }

    public BigDecimal getRateValue()
    {
        return rateValue;
    }

    public void setRateValue(BigDecimal rateValue)
    {
        this.rateValue = rateValue;
    }

    public Date getEffectiveDate()
    {
        return effectiveDate;
    }

    public void setEffectiveDate(Date effectiveDate)
    {
        this.effectiveDate = effectiveDate;
    }

    public String getIsActive()
    {
        return isActive;
    }

    public void setIsActive(String isActive)
    {
        this.isActive = isActive;
    }

    @Override
    public String toString()
    {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("rateId", getRateId())
            .append("currencyPair", getCurrencyPair())
            .append("rateValue", getRateValue())
            .append("effectiveDate", getEffectiveDate())
            .append("isActive", getIsActive())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("remark", getRemark())
            .toString();
    }
}