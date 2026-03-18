package com.ruoyi.system.pms.domain;

import java.math.BigDecimal;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import java.io.Serializable;

/**
 * 价格明细表 pms_price_detail
 *
 * @author ruoyi
 */
public class PmsPriceDetail implements Serializable
{
    private static final long serialVersionUID = 1L;

    /** 明细ID */
    private Long detailId;

    /** 价格ID */
    private Long priceId;

    /** 费用类型 */
    private String feeType;

    /** 费用名称 */
    private String feeName;

    /** 金额(AUD) */
    private BigDecimal amountAud;

    /** 排序 */
    private Integer sortOrder;

    /** 备注 */
    private String remark;

    /** 创建者 */
    private String createBy;

    /** 创建时间 */
    private java.util.Date createTime;

    public Long getDetailId()
    {
        return detailId;
    }

    public void setDetailId(Long detailId)
    {
        this.detailId = detailId;
    }

    public Long getPriceId()
    {
        return priceId;
    }

    public void setPriceId(Long priceId)
    {
        this.priceId = priceId;
    }

    public String getFeeType()
    {
        return feeType;
    }

    public void setFeeType(String feeType)
    {
        this.feeType = feeType;
    }

    public String getFeeName()
    {
        return feeName;
    }

    public void setFeeName(String feeName)
    {
        this.feeName = feeName;
    }

    public BigDecimal getAmountAud()
    {
        return amountAud;
    }

    public void setAmountAud(BigDecimal amountAud)
    {
        this.amountAud = amountAud;
    }

    public Integer getSortOrder()
    {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder)
    {
        this.sortOrder = sortOrder;
    }

    public String getRemark()
    {
        return remark;
    }

    public void setRemark(String remark)
    {
        this.remark = remark;
    }

    public String getCreateBy()
    {
        return createBy;
    }

    public void setCreateBy(String createBy)
    {
        this.createBy = createBy;
    }

    public java.util.Date getCreateTime()
    {
        return createTime;
    }

    public void setCreateTime(java.util.Date createTime)
    {
        this.createTime = createTime;
    }

    @Override
    public String toString()
    {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("detailId", getDetailId())
            .append("priceId", getPriceId())
            .append("feeType", getFeeType())
            .append("feeName", getFeeName())
            .append("amountAud", getAmountAud())
            .append("sortOrder", getSortOrder())
            .append("remark", getRemark())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .toString();
    }
}