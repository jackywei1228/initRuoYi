package com.ruoyi.system.pms.mapper;

import java.util.List;
import com.ruoyi.system.pms.domain.PmsDistributorLevel;

/**
 * 经销商等级 数据层
 *
 * @author ruoyi
 */
public interface PmsDistributorLevelMapper
{
    /**
     * 查询经销商等级
     *
     * @param levelId 等级ID
     * @return 经销商等级
     */
    public PmsDistributorLevel selectDistributorLevelById(Long levelId);

    /**
     * 查询经销商等级列表
     *
     * @param pmsDistributorLevel 经销商等级
     * @return 经销商等级集合
     */
    public List<PmsDistributorLevel> selectDistributorLevelList(PmsDistributorLevel pmsDistributorLevel);

    /**
     * 新增经销商等级
     *
     * @param pmsDistributorLevel 经销商等级
     * @return 结果
     */
    public int insertDistributorLevel(PmsDistributorLevel pmsDistributorLevel);

    /**
     * 修改经销商等级
     *
     * @param pmsDistributorLevel 经销商等级
     * @return 结果
     */
    public int updateDistributorLevel(PmsDistributorLevel pmsDistributorLevel);

    /**
     * 删除经销商等级
     *
     * @param levelId 等级ID
     * @return 结果
     */
    public int deleteDistributorLevelById(Long levelId);

    /**
     * 批量删除经销商等级
     *
     * @param levelIds 需要删除的数据ID
     * @return 结果
     */
    public int deleteDistributorLevelByIds(Long[] levelIds);

    /**
     * 校验等级名称是否唯一
     *
     * @param levelName 等级名称
     * @return 结果
     */
    public PmsDistributorLevel checkLevelNameUnique(String levelName);
}