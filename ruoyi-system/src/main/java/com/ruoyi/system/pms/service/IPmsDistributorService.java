package com.ruoyi.system.pms.service;

import java.util.List;
import com.ruoyi.system.pms.domain.PmsDistributor;

/**
 * 经销商 服务层
 *
 * @author ruoyi
 */
public interface IPmsDistributorService
{
    /**
     * 查询经销商
     *
     * @param distributorId 经销商ID
     * @return 经销商
     */
    public PmsDistributor selectDistributorById(Long distributorId);

    /**
     * 查询经销商列表
     *
     * @param pmsDistributor 经销商
     * @return 经销商集合
     */
    public List<PmsDistributor> selectDistributorList(PmsDistributor pmsDistributor);

    /**
     * 根据等级ID查询经销商列表
     *
     * @param levelId 等级ID
     * @return 经销商集合
     */
    public List<PmsDistributor> getByLevelId(Long levelId);

    /**
     * 根据用户ID查询经销商
     *
     * @param userId 用户ID
     * @return 经销商
     */
    public PmsDistributor selectDistributorByUserId(Long userId);

    /**
     * 新增经销商
     *
     * @param pmsDistributor 经销商
     * @return 结果
     */
    public int insertDistributor(PmsDistributor pmsDistributor);

    /**
     * 修改经销商
     *
     * @param pmsDistributor 经销商
     * @return 结果
     */
    public int updateDistributor(PmsDistributor pmsDistributor);

    /**
     * 删除经销商
     *
     * @param distributorId 经销商ID
     * @return 结果
     */
    public int deleteDistributorById(Long distributorId);

    /**
     * 批量删除经销商
     *
     * @param distributorIds 需要删除的数据ID
     * @return 结果
     */
    public int deleteDistributorByIds(Long[] distributorIds);

    /**
     * 校验公司名称是否唯一
     *
     * @param pmsDistributor 经销商
     * @return 结果
     */
    public boolean checkCompanyNameUnique(PmsDistributor pmsDistributor);
}