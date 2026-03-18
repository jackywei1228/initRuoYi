package com.ruoyi.system.pms.domain;

import java.math.BigDecimal;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 经销商等级表 pms_distributor_level
 *
 * @author ruoyi
 */
public class PmsDistributorLevel extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 等级ID */
    private Long levelId;

    /** 等级名称 */
    private String levelName;

    /** 折扣率 */
    private BigDecimal discountRate;

    /** 是否可见经销商价格 */
    private String visibleDbp;

    /** 是否可见建议零售价 */
    private String visibleRrp;

    /** 优先级 */
    private Integer priority;

    public Long getLevelId()
    {
        return levelId;
    }

    public void setLevelId(Long levelId)
    {
        this.levelId = levelId;
    }

    public String getLevelName()
    {
        return levelName;
    }

    public void setLevelName(String levelName)
    {
        this.levelName = levelName;
    }

    public BigDecimal getDiscountRate()
    {
        return discountRate;
    }

    public void setDiscountRate(BigDecimal discountRate)
    {
        this.discountRate = discountRate;
    }

    public String getVisibleDbp()
    {
        return visibleDbp;
    }

    public void setVisibleDbp(String visibleDbp)
    {
        this.visibleDbp = visibleDbp;
    }

    public String getVisibleRrp()
    {
        return visibleRrp;
    }

    public void setVisibleRrp(String visibleRrp)
    {
        this.visibleRrp = visibleRrp;
    }

    public Integer getPriority()
    {
        return priority;
    }

    public void setPriority(Integer priority)
    {
        this.priority = priority;
    }

    @Override
    public String toString()
    {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("levelId", getLevelId())
            .append("levelName", getLevelName())
            .append("discountRate", getDiscountRate())
            .append("visibleDbp", getVisibleDbp())
            .append("visibleRrp", getVisibleRrp())
            .append("priority", getPriority())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .append("remark", getRemark())
            .toString();
    }
}