package com.ruoyi.system.pms.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.system.pms.domain.PmsImportRecord;
import com.ruoyi.system.pms.mapper.PmsImportRecordMapper;
import com.ruoyi.system.pms.service.IPmsImportRecordService;

/**
 * 导入记录 服务层处理
 *
 * @author ruoyi
 */
@Service
public class PmsImportRecordServiceImpl implements IPmsImportRecordService
{
    @Autowired
    private PmsImportRecordMapper importRecordMapper;

    /**
     * 查询导入记录
     *
     * @param recordId 记录ID
     * @return 导入记录
     */
    @Override
    public PmsImportRecord selectImportRecordById(Long recordId)
    {
        return importRecordMapper.selectImportRecordById(recordId);
    }

    /**
     * 查询导入记录列表
     *
     * @param pmsImportRecord 导入记录
     * @return 导入记录
     */
    @Override
    public List<PmsImportRecord> selectRecordList(PmsImportRecord pmsImportRecord)
    {
        return importRecordMapper.selectImportRecordList(pmsImportRecord);
    }

    /**
     * 新增导入记录
     *
     * @param record 导入记录
     * @return 结果
     */
    @Override
    @Transactional
    public int insertRecord(PmsImportRecord record)
    {
        record.setCreateTime(DateUtils.getNowDate());
        return importRecordMapper.insertImportRecord(record);
    }

    /**
     * 修改导入记录状态
     *
     * @param recordId 记录ID
     * @param status 状态
     * @param successCount 成功数
     * @param failCount 失败数
     * @return 结果
     */
    @Override
    @Transactional
    public int updateRecordStatus(Long recordId, String status, int successCount, int failCount)
    {
        PmsImportRecord record = new PmsImportRecord();
        record.setRecordId(recordId);
        record.setStatus(status);
        record.setSuccessCount(successCount);
        record.setFailCount(failCount);
        return importRecordMapper.updateImportRecord(record);
    }

    /**
     * 修改导入记录
     *
     * @param pmsImportRecord 导入记录
     * @return 结果
     */
    @Override
    @Transactional
    public int updateImportRecord(PmsImportRecord pmsImportRecord)
    {
        return importRecordMapper.updateImportRecord(pmsImportRecord);
    }

    /**
     * 删除导入记录
     *
     * @param recordId 记录ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteImportRecordById(Long recordId)
    {
        return importRecordMapper.deleteImportRecordById(recordId);
    }

    /**
     * 批量删除导入记录
     *
     * @param recordIds 需要删除的数据ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteImportRecordByIds(Long[] recordIds)
    {
        return importRecordMapper.deleteImportRecordByIds(recordIds);
    }
}