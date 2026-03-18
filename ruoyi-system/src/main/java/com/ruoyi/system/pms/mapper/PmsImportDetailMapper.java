package com.ruoyi.system.pms.mapper;

import java.util.List;
import com.ruoyi.system.pms.domain.PmsImportDetail;

/**
 * 导入明细 数据层
 *
 * @author ruoyi
 */
public interface PmsImportDetailMapper
{
    /**
     * 查询导入明细
     *
     * @param detailId 明细ID
     * @return 导入明细
     */
    public PmsImportDetail selectImportDetailById(Long detailId);

    /**
     * 查询导入明细列表
     *
     * @param pmsImportDetail 导入明细
     * @return 导入明细集合
     */
    public List<PmsImportDetail> selectImportDetailList(PmsImportDetail pmsImportDetail);

    /**
     * 根据记录ID查询明细列表
     *
     * @param recordId 记录ID
     * @return 导入明细集合
     */
    public List<PmsImportDetail> selectByRecordId(Long recordId);

    /**
     * 新增导入明细
     *
     * @param pmsImportDetail 导入明细
     * @return 结果
     */
    public int insertImportDetail(PmsImportDetail pmsImportDetail);

    /**
     * 批量新增导入明细
     *
     * @param list 导入明细列表
     * @return 结果
     */
    public int batchInsertImportDetail(List<PmsImportDetail> list);

    /**
     * 修改导入明细
     *
     * @param pmsImportDetail 导入明细
     * @return 结果
     */
    public int updateImportDetail(PmsImportDetail pmsImportDetail);

    /**
     * 删除导入明细
     *
     * @param detailId 明细ID
     * @return 结果
     */
    public int deleteImportDetailById(Long detailId);

    /**
     * 根据记录ID删除明细
     *
     * @param recordId 记录ID
     * @return 结果
     */
    public int deleteByRecordId(Long recordId);

    /**
     * 批量删除导入明细
     *
     * @param detailIds 需要删除的数据ID
     * @return 结果
     */
    public int deleteImportDetailByIds(Long[] detailIds);
}