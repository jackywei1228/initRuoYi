package com.ruoyi.system.pms.service;

import java.util.List;
import com.ruoyi.system.pms.domain.PmsImportDetail;

/**
 * 导入明细 服务层
 *
 * @author ruoyi
 */
public interface IPmsImportDetailService
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
    public List<PmsImportDetail> getByRecordId(Long recordId);

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
     * @param details 导入明细列表
     */
    public void batchInsert(List<PmsImportDetail> details);

    /**
     * 修改导入明细
     *
     * @param pmsImportDetail 导入明细
     * @return 结果
     */
    public int updateImportDetail(PmsImportDetail pmsImportDetail);

    /**
     * 更新验证状态
     *
     * @param detailId 明细ID
     * @param verifyStatus 验证状态
     * @param verifyRemark 验证备注
     * @return 结果
     */
    public int updateVerifyStatus(Long detailId, String verifyStatus, String verifyRemark);

    /**
     * 批量更新验证状态
     *
     * @param recordId 记录ID
     * @param verifyStatus 验证状态
     */
    public void batchUpdateVerifyStatus(Long recordId, String verifyStatus);

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