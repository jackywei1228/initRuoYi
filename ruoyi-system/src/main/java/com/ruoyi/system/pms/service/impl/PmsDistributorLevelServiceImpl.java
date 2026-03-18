package com.ruoyi.system.pms.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ruoyi.common.constant.UserConstants;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.system.pms.domain.PmsDistributorLevel;
import com.ruoyi.system.pms.mapper.PmsDistributorLevelMapper;
import com.ruoyi.system.pms.service.IPmsDistributorLevelService;

/**
 * 经销商等级 服务层处理
 *
 * @author ruoyi
 */
@Service
public class PmsDistributorLevelServiceImpl implements IPmsDistributorLevelService
{
    @Autowired
    private PmsDistributorLevelMapper distributorLevelMapper;

    /**
     * 查询经销商等级
     *
     * @param levelId 等级ID
     * @return 经销商等级
     */
    @Override
    public PmsDistributorLevel selectDistributorLevelById(Long levelId)
    {
        return distributorLevelMapper.selectDistributorLevelById(levelId);
    }

    /**
     * 查询经销商等级列表
     *
     * @param pmsDistributorLevel 经销商等级
     * @return 经销商等级
     */
    @Override
    public List<PmsDistributorLevel> selectDistributorLevelList(PmsDistributorLevel pmsDistributorLevel)
    {
        return distributorLevelMapper.selectDistributorLevelList(pmsDistributorLevel);
    }

    /**
     * 新增经销商等级
     *
     * @param pmsDistributorLevel 经销商等级
     * @return 结果
     */
    @Override
    @Transactional
    public int insertDistributorLevel(PmsDistributorLevel pmsDistributorLevel)
    {
        pmsDistributorLevel.setCreateTime(DateUtils.getNowDate());
        return distributorLevelMapper.insertDistributorLevel(pmsDistributorLevel);
    }

    /**
     * 修改经销商等级
     *
     * @param pmsDistributorLevel 经销商等级
     * @return 结果
     */
    @Override
    @Transactional
    public int updateDistributorLevel(PmsDistributorLevel pmsDistributorLevel)
    {
        pmsDistributorLevel.setUpdateTime(DateUtils.getNowDate());
        return distributorLevelMapper.updateDistributorLevel(pmsDistributorLevel);
    }

    /**
     * 删除经销商等级
     *
     * @param levelId 等级ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteDistributorLevelById(Long levelId)
    {
        return distributorLevelMapper.deleteDistributorLevelById(levelId);
    }

    /**
     * 批量删除经销商等级
     *
     * @param levelIds 需要删除的数据ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteDistributorLevelByIds(Long[] levelIds)
    {
        return distributorLevelMapper.deleteDistributorLevelByIds(levelIds);
    }

    /**
     * 校验等级名称是否唯一
     *
     * @param pmsDistributorLevel 经销商等级
     * @return 结果
     */
    @Override
    public boolean checkLevelNameUnique(PmsDistributorLevel pmsDistributorLevel)
    {
        Long levelId = StringUtils.isNull(pmsDistributorLevel.getLevelId()) ? -1L : pmsDistributorLevel.getLevelId();
        PmsDistributorLevel info = distributorLevelMapper.checkLevelNameUnique(pmsDistributorLevel.getLevelName());
        if (StringUtils.isNotNull(info) && info.getLevelId().longValue() != levelId.longValue())
        {
            return UserConstants.NOT_UNIQUE;
        }
        return UserConstants.UNIQUE;
    }
}