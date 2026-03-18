package com.ruoyi.system.pms.mapper;

import java.util.List;
import com.ruoyi.system.pms.domain.PmsImportRecord;

/**
 * 导入记录 数据层
 *
 * @author ruoyi
 */
public interface PmsImportRecordMapper
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
    public List<PmsImportRecord> selectImportRecordList(PmsImportRecord pmsImportRecord);

    /**
     * 新增导入记录
     *
     * @param pmsImportRecord 导入记录
     * @return 结果
     */
    public int insertImportRecord(PmsImportRecord pmsImportRecord);

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