package com.ruoyi.system.pms.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ruoyi.common.constant.UserConstants;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.system.pms.domain.PmsDistributor;
import com.ruoyi.system.pms.mapper.PmsDistributorMapper;
import com.ruoyi.system.pms.service.IPmsDistributorService;

/**
 * 经销商 服务层处理
 *
 * @author ruoyi
 */
@Service
public class PmsDistributorServiceImpl implements IPmsDistributorService
{
    @Autowired
    private PmsDistributorMapper distributorMapper;

    /**
     * 查询经销商
     *
     * @param distributorId 经销商ID
     * @return 经销商
     */
    @Override
    public PmsDistributor selectDistributorById(Long distributorId)
    {
        return distributorMapper.selectDistributorById(distributorId);
    }

    /**
     * 查询经销商列表
     *
     * @param pmsDistributor 经销商
     * @return 经销商
     */
    @Override
    public List<PmsDistributor> selectDistributorList(PmsDistributor pmsDistributor)
    {
        return distributorMapper.selectDistributorList(pmsDistributor);
    }

    /**
     * 根据等级ID查询经销商列表
     *
     * @param levelId 等级ID
     * @return 经销商集合
     */
    @Override
    public List<PmsDistributor> getByLevelId(Long levelId)
    {
        return distributorMapper.selectByLevelId(levelId);
    }

    /**
     * 根据用户ID查询经销商
     *
     * @param userId 用户ID
     * @return 经销商
     */
    @Override
    public PmsDistributor selectDistributorByUserId(Long userId)
    {
        return distributorMapper.selectDistributorByUserId(userId);
    }

    /**
     * 新增经销商
     *
     * @param pmsDistributor 经销商
     * @return 结果
     */
    @Override
    @Transactional
    public int insertDistributor(PmsDistributor pmsDistributor)
    {
        pmsDistributor.setCreateTime(DateUtils.getNowDate());
        return distributorMapper.insertDistributor(pmsDistributor);
    }

    /**
     * 修改经销商
     *
     * @param pmsDistributor 经销商
     * @return 结果
     */
    @Override
    @Transactional
    public int updateDistributor(PmsDistributor pmsDistributor)
    {
        pmsDistributor.setUpdateTime(DateUtils.getNowDate());
        return distributorMapper.updateDistributor(pmsDistributor);
    }

    /**
     * 删除经销商
     *
     * @param distributorId 经销商ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteDistributorById(Long distributorId)
    {
        return distributorMapper.deleteDistributorById(distributorId);
    }

    /**
     * 批量删除经销商
     *
     * @param distributorIds 需要删除的数据ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteDistributorByIds(Long[] distributorIds)
    {
        return distributorMapper.deleteDistributorByIds(distributorIds);
    }

    /**
     * 校验公司名称是否唯一
     *
     * @param pmsDistributor 经销商
     * @return 结果
     */
    @Override
    public boolean checkCompanyNameUnique(PmsDistributor pmsDistributor)
    {
        Long distributorId = StringUtils.isNull(pmsDistributor.getDistributorId()) ? -1L : pmsDistributor.getDistributorId();
        PmsDistributor info = distributorMapper.checkCompanyNameUnique(pmsDistributor.getCompanyName());
        if (StringUtils.isNotNull(info) && info.getDistributorId().longValue() != distributorId.longValue())
        {
            return UserConstants.NOT_UNIQUE;
        }
        return UserConstants.UNIQUE;
    }
}