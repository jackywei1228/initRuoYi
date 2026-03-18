package com.ruoyi.system.pms.domain;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import java.io.Serializable;
import java.util.Date;

/**
 * 价格历史表 pms_price_history
 *
 * @author ruoyi
 */
public class PmsPriceHistory implements Serializable
{
    private static final long serialVersionUID = 1L;

    /** 历史ID */
    private Long historyId;

    /** 价格ID */
    private Long priceId;

    /** 变更类型 */
    private String changeType;

    /** 变更前数据(JSON) */
    private String beforeData;

    /** 变更后数据(JSON) */
    private String afterData;

    /** 变更原因 */
    private String changeReason;

    /** 创建者 */
    private String createBy;

    /** 创建时间 */
    private Date createTime;

    public Long getHistoryId()
    {
        return historyId;
    }

    public void setHistoryId(Long historyId)
    {
        this.historyId = historyId;
    }

    public Long getPriceId()
    {
        return priceId;
    }

    public void setPriceId(Long priceId)
    {
        this.priceId = priceId;
    }

    public String getChangeType()
    {
        return changeType;
    }

    public void setChangeType(String changeType)
    {
        this.changeType = changeType;
    }

    public String getBeforeData()
    {
        return beforeData;
    }

    public void setBeforeData(String beforeData)
    {
        this.beforeData = beforeData;
    }

    public String getAfterData()
    {
        return afterData;
    }

    public void setAfterData(String afterData)
    {
        this.afterData = afterData;
    }

    public String getChangeReason()
    {
        return changeReason;
    }

    public void setChangeReason(String changeReason)
    {
        this.changeReason = changeReason;
    }

    public String getCreateBy()
    {
        return createBy;
    }

    public void setCreateBy(String createBy)
    {
        this.createBy = createBy;
    }

    public Date getCreateTime()
    {
        return createTime;
    }

    public void setCreateTime(Date createTime)
    {
        this.createTime = createTime;
    }

    @Override
    public String toString()
    {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("historyId", getHistoryId())
            .append("priceId", getPriceId())
            .append("changeType", getChangeType())
            .append("beforeData", getBeforeData())
            .append("afterData", getAfterData())
            .append("changeReason", getChangeReason())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .toString();
    }
}