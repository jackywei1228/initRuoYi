package com.ruoyi.system.pms.domain;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import java.io.Serializable;
import java.util.Date;

/**
 * 导入明细表 pms_import_detail
 *
 * @author ruoyi
 */
public class PmsImportDetail implements Serializable
{
    private static final long serialVersionUID = 1L;

    /** 明细ID */
    private Long detailId;

    /** 记录ID */
    private Long recordId;

    /** 行号 */
    private Integer rowNumber;

    /** 原始数据(JSON) */
    private String rawData;

    /** 解析数据(JSON) */
    private String parsedData;

    /** 验证状态（0待验证 1成功 2失败） */
    private String verifyStatus;

    /** 验证备注 */
    private String verifyRemark;

    /** 创建时间 */
    private Date createTime;

    public Long getDetailId()
    {
        return detailId;
    }

    public void setDetailId(Long detailId)
    {
        this.detailId = detailId;
    }

    public Long getRecordId()
    {
        return recordId;
    }

    public void setRecordId(Long recordId)
    {
        this.recordId = recordId;
    }

    public Integer getRowNumber()
    {
        return rowNumber;
    }

    public void setRowNumber(Integer rowNumber)
    {
        this.rowNumber = rowNumber;
    }

    public String getRawData()
    {
        return rawData;
    }

    public void setRawData(String rawData)
    {
        this.rawData = rawData;
    }

    public String getParsedData()
    {
        return parsedData;
    }

    public void setParsedData(String parsedData)
    {
        this.parsedData = parsedData;
    }

    public String getVerifyStatus()
    {
        return verifyStatus;
    }

    public void setVerifyStatus(String verifyStatus)
    {
        this.verifyStatus = verifyStatus;
    }

    public String getVerifyRemark()
    {
        return verifyRemark;
    }

    public void setVerifyRemark(String verifyRemark)
    {
        this.verifyRemark = verifyRemark;
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
            .append("detailId", getDetailId())
            .append("recordId", getRecordId())
            .append("rowNumber", getRowNumber())
            .append("rawData", getRawData())
            .append("parsedData", getParsedData())
            .append("verifyStatus", getVerifyStatus())
            .append("verifyRemark", getVerifyRemark())
            .append("createTime", getCreateTime())
            .toString();
    }
}