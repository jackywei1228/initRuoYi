package com.ruoyi.system.pms.service;

import java.util.List;
import com.ruoyi.system.pms.domain.PmsImportRecord;

/**
 * 导入记录 服务层
 *
 * @author ruoyi
 */
public interface IPmsImportRecordService
{
    /**
     * 查询导入记录
     *
     * @param recordId 记录ID
     * @return 导入记录
     */
    public PmsImportRecord selectImportRecordById(Long recordId);

    /**
     * 查询导入记录列表
     *
     * @param pmsImportRecord 导入记录
     * @return 导入记录集合
     */
    public List<PmsImportRecord> selectRecordList(PmsImportRecord pmsImportRecord);

    /**
     * 新增导入记录
     *
     * @param record 导入记录
     * @return 结果
     */
    public int insertRecord(PmsImportRecord record);

    /**
     * 修改导入记录状态
     *
     * @param recordId 记录ID
     * @param status 状态
     * @param successCount 成功数
     * @param failCount 失败数
     * @return 结果
     */
    public int updateRecordStatus(Long recordId, String status, int successCount, int failCount);

    /**
     * 修改导入记录
     *
     * @param pmsImportRecord 导入记录
     * @return 结果
     */
    public int updateImportRecord(PmsImportRecord pmsImportRecord);

    /**
     * 删除导入记录
     *
     * @param recordId 记录ID
     * @return 结果
     */
    public int deleteImportRecordById(Long recordId);

    /**
     * 批量删除导入记录
     *
     * @param recordIds 需要删除的数据ID
     * @return 结果
     */
    public int deleteImportRecordByIds(Long[] recordIds);
}