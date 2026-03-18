package com.ruoyi.system.pms.domain;

import java.math.BigDecimal;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 经销商表 pms_distributor
 *
 * @author ruoyi
 */
public class PmsDistributor extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 经销商ID */
    private Long distributorId;

    /** 用户ID */
    private Long userId;

    /** 等级ID */
    private Long levelId;

    /** 公司名称 */
    private String companyName;

    /** 联系人姓名 */
    private String contactName;

    /** 联系电话 */
    private String contactPhone;

    /** 联系邮箱 */
    private String contactEmail;

    /** 地址 */
    private String address;

    /** 信用额度 */
    private BigDecimal creditLimit;

    /** 状态（0正常 1停用） */
    private String status;

    public Long getDistributorId()
    {
        return distributorId;
    }

    public void setDistributorId(Long distributorId)
    {
        this.distributorId = distributorId;
    }

    public Long getUserId()
    {
        return userId;
    }

    public void setUserId(Long userId)
    {
        this.userId = userId;
    }

    public Long getLevelId()
    {
        return levelId;
    }

    public void setLevelId(Long levelId)
    {
        this.levelId = levelId;
    }

    public String getCompanyName()
    {
        return companyName;
    }

    public void setCompanyName(String companyName)
    {
        this.companyName = companyName;
    }

    public String getContactName()
    {
        return contactName;
    }

    public void setContactName(String contactName)
    {
        this.contactName = contactName;
    }

    public String getContactPhone()
    {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone)
    {
        this.contactPhone = contactPhone;
    }

    public String getContactEmail()
    {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail)
    {
        this.contactEmail = contactEmail;
    }

    public String getAddress()
    {
        return address;
    }

    public void setAddress(String address)
    {
        this.address = address;
    }

    public BigDecimal getCreditLimit()
    {
        return creditLimit;
    }

    public void setCreditLimit(BigDecimal creditLimit)
    {
        this.creditLimit = creditLimit;
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
            .append("distributorId", getDistributorId())
            .append("userId", getUserId())
            .append("levelId", getLevelId())
            .append("companyName", getCompanyName())
            .append("contactName", getContactName())
            .append("contactPhone", getContactPhone())
            .append("contactEmail", getContactEmail())
            .append("address", getAddress())
            .append("creditLimit", getCreditLimit())
            .append("status", getStatus())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .append("remark", getRemark())
            .toString();
    }
}