package com.ruoyi.system.pms.domain;

import java.math.BigDecimal;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 配件值表 pms_accessory_value
 *
 * @author ruoyi
 */
public class PmsAccessoryValue extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 配件值ID */
    private Long valueId;

    /** 类型ID */
    private Long typeId;

    /** 配件值名称 */
    private String valueName;

    /** 规格描述 */
    private String specDescription;

    /** 加价金额(USD) */
    private BigDecimal priceAddUsd;

    /** 排序 */
    private Integer sortOrder;

    /** 状态（0正常 1停用） */
    private String status;

    public Long getValueId()
    {
        return valueId;
    }

    public void setValueId(Long valueId)
    {
        this.valueId = valueId;
    }

    public Long getTypeId()
    {
        return typeId;
    }

    public void setTypeId(Long typeId)
    {
        this.typeId = typeId;
    }

    public String getValueName()
    {
        return valueName;
    }

    public void setValueName(String valueName)
    {
        this.valueName = valueName;
    }

    public String getSpecDescription()
    {
        return specDescription;
    }

    public void setSpecDescription(String specDescription)
    {
        this.specDescription = specDescription;
    }

    public BigDecimal getPriceAddUsd()
    {
        return priceAddUsd;
    }

    public void setPriceAddUsd(BigDecimal priceAddUsd)
    {
        this.priceAddUsd = priceAddUsd;
    }

    public Integer getSortOrder()
    {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder)
    {
        this.sortOrder = sortOrder;
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
            .append("valueId", getValueId())
            .append("typeId", getTypeId())
            .append("valueName", getValueName())
            .append("specDescription", getSpecDescription())
            .append("priceAddUsd", getPriceAddUsd())
            .append("sortOrder", getSortOrder())
            .append("status", getStatus())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .toString();
    }
}