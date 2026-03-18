package com.ruoyi.system.pms.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.system.pms.domain.PmsImportDetail;
import com.ruoyi.system.pms.mapper.PmsImportDetailMapper;
import com.ruoyi.system.pms.service.IPmsImportDetailService;

/**
 * 导入明细 服务层处理
 *
 * @author ruoyi
 */
@Service
public class PmsImportDetailServiceImpl implements IPmsImportDetailService
{
    @Autowired
    private PmsImportDetailMapper importDetailMapper;

    /**
     * 查询导入明细
     *
     * @param detailId 明细ID
     * @return 导入明细
     */
    @Override
    public PmsImportDetail selectImportDetailById(Long detailId)
    {
        return importDetailMapper.selectImportDetailById(detailId);
    }

    /**
     * 查询导入明细列表
     *
     * @param pmsImportDetail 导入明细
     * @return 导入明细
     */
    @Override
    public List<PmsImportDetail> selectImportDetailList(PmsImportDetail pmsImportDetail)
    {
        return importDetailMapper.selectImportDetailList(pmsImportDetail);
    }

    /**
     * 根据记录ID查询明细列表
     *
     * @param recordId 记录ID
     * @return 导入明细集合
     */
    @Override
    public List<PmsImportDetail> getByRecordId(Long recordId)
    {
        return importDetailMapper.selectByRecordId(recordId);
    }

    /**
     * 新增导入明细
     *
     * @param pmsImportDetail 导入明细
     * @return 结果
     */
    @Override
    @Transactional
    public int insertImportDetail(PmsImportDetail pmsImportDetail)
    {
        pmsImportDetail.setCreateTime(DateUtils.getNowDate());
        return importDetailMapper.insertImportDetail(pmsImportDetail);
    }

    /**
     * 批量新增导入明细
     *
     * @param details 导入明细列表
     */
    @Override
    @Transactional
    public void batchInsert(List<PmsImportDetail> details)
    {
        if (StringUtils.isNotEmpty(details))
        {
            for (PmsImportDetail detail : details)
            {
                detail.setCreateTime(DateUtils.getNowDate());
            }
            importDetailMapper.batchInsertImportDetail(details);
        }
    }

    /**
     * 修改导入明细
     *
     * @param pmsImportDetail 导入明细
     * @return 结果
     */
    @Override
    @Transactional
    public int updateImportDetail(PmsImportDetail pmsImportDetail)
    {
        return importDetailMapper.updateImportDetail(pmsImportDetail);
    }

    /**
     * 更新验证状态
     *
     * @param detailId 明细ID
     * @param verifyStatus 验证状态
     * @param verifyRemark 验证备注
     * @return 结果
     */
    @Override
    @Transactional
    public int updateVerifyStatus(Long detailId, String verifyStatus, String verifyRemark)
    {
        PmsImportDetail detail = new PmsImportDetail();
        detail.setDetailId(detailId);
        detail.setVerifyStatus(verifyStatus);
        detail.setVerifyRemark(verifyRemark);
        return importDetailMapper.updateImportDetail(detail);
    }

    /**
     * 批量更新验证状态
     *
     * @param recordId 记录ID
     * @param verifyStatus 验证状态
     */
    @Override
    @Transactional
    public void batchUpdateVerifyStatus(Long recordId, String verifyStatus)
    {
        List<PmsImportDetail> details = importDetailMapper.selectByRecordId(recordId);
        if (StringUtils.isNotEmpty(details))
        {
            for (PmsImportDetail detail : details)
            {
                detail.setVerifyStatus(verifyStatus);
                importDetailMapper.updateImportDetail(detail);
            }
        }
    }

    /**
     * 删除导入明细
     *
     * @param detailId 明细ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteImportDetailById(Long detailId)
    {
        return importDetailMapper.deleteImportDetailById(detailId);
    }

    /**
     * 根据记录ID删除明细
     *
     * @param recordId 记录ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteByRecordId(Long recordId)
    {
        return importDetailMapper.deleteByRecordId(recordId);
    }

    /**
     * 批量删除导入明细
     *
     * @param detailIds 需要删除的数据ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteImportDetailByIds(Long[] detailIds)
    {
        return importDetailMapper.deleteImportDetailByIds(detailIds);
    }
}