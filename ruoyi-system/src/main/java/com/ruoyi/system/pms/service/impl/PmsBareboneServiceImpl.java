package com.ruoyi.system.pms.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ruoyi.common.constant.UserConstants;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.system.pms.domain.PmsBarebone;
import com.ruoyi.system.pms.domain.PmsBareboneAccessory;
import com.ruoyi.system.pms.mapper.PmsBareboneMapper;
import com.ruoyi.system.pms.mapper.PmsBareboneAccessoryMapper;
import com.ruoyi.system.pms.service.IPmsBareboneService;

/**
 * 基础型号(SPU) 服务层处理
 *
 * @author ruoyi
 */
@Service
public class PmsBareboneServiceImpl implements IPmsBareboneService
{
    @Autowired
    private PmsBareboneMapper bareboneMapper;

    @Autowired
    private PmsBareboneAccessoryMapper bareboneAccessoryMapper;

    /**
     * 查询基础型号
     *
     * @param bareboneId 基础型号ID
     * @return 基础型号
     */
    @Override
    public PmsBarebone selectBareboneById(Long bareboneId)
    {
        return bareboneMapper.selectBareboneById(bareboneId);
    }

    /**
     * 查询基础型号列表
     *
     * @param pmsBarebone 基础型号
     * @return 基础型号
     */
    @Override
    public List<PmsBarebone> selectBareboneList(PmsBarebone pmsBarebone)
    {
        return bareboneMapper.selectBareboneList(pmsBarebone);
    }

    /**
     * 新增基础型号
     *
     * @param pmsBarebone 基础型号
     * @return 结果
     */
    @Override
    @Transactional
    public int insertBarebone(PmsBarebone pmsBarebone)
    {
        pmsBarebone.setCreateTime(DateUtils.getNowDate());
        return bareboneMapper.insertBarebone(pmsBarebone);
    }

    /**
     * 修改基础型号
     *
     * @param pmsBarebone 基础型号
     * @return 结果
     */
    @Override
    @Transactional
    public int updateBarebone(PmsBarebone pmsBarebone)
    {
        pmsBarebone.setUpdateTime(DateUtils.getNowDate());
        return bareboneMapper.updateBarebone(pmsBarebone);
    }

    /**
     * 删除基础型号
     *
     * @param bareboneId 基础型号ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteBareboneById(Long bareboneId)
    {
        // 删除关联的配件
        bareboneAccessoryMapper.deleteByBareboneId(bareboneId);
        return bareboneMapper.deleteBareboneById(bareboneId);
    }

    /**
     * 批量删除基础型号
     *
     * @param bareboneIds 需要删除的数据ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteBareboneByIds(Long[] bareboneIds)
    {
        // 删除关联的配件
        for (Long bareboneId : bareboneIds)
        {
            bareboneAccessoryMapper.deleteByBareboneId(bareboneId);
        }
        return bareboneMapper.deleteBareboneByIds(bareboneIds);
    }

    /**
     * 校验型号名称是否唯一
     *
     * @param pmsBarebone 基础型号
     * @return 结果
     */
    @Override
    public boolean checkModelNameUnique(PmsBarebone pmsBarebone)
    {
        Long bareboneId = StringUtils.isNull(pmsBarebone.getBareboneId()) ? -1L : pmsBarebone.getBareboneId();
        PmsBarebone info = bareboneMapper.checkModelNameUnique(pmsBarebone.getModelName());
        if (StringUtils.isNotNull(info) && info.getBareboneId().longValue() != bareboneId.longValue())
        {
            return UserConstants.NOT_UNIQUE;
        }
        return UserConstants.UNIQUE;
    }

    /**
     * 绑定配件到基础型号
     *
     * @param bareboneId 基础型号ID
     * @param accessories 配件列表
     * @return 结果
     */
    @Override
    @Transactional
    public int bindAccessories(Long bareboneId, List<PmsBareboneAccessory> accessories)
    {
        // 先删除旧的关联
        bareboneAccessoryMapper.deleteByBareboneId(bareboneId);
        // 再插入新的关联
        if (StringUtils.isNotEmpty(accessories))
        {
            for (PmsBareboneAccessory accessory : accessories)
            {
                accessory.setBareboneId(bareboneId);
            }
            return bareboneAccessoryMapper.batchInsertBareboneAccessory(accessories);
        }
        return 0;
    }

    /**
     * 获取基础型号的配件列表
     *
     * @param bareboneId 基础型号ID
     * @return 配件列表
     */
    @Override
    public List<PmsBareboneAccessory> getAccessories(Long bareboneId)
    {
        return bareboneAccessoryMapper.selectByBareboneId(bareboneId);
    }

    /**
     * 比较多个基础型号
     *
     * @param bareboneIds 基础型号ID数组
     * @return 基础型号列表
     */
    @Override
    public List<PmsBarebone> compareBarebones(Long[] bareboneIds)
    {
        if (StringUtils.isEmpty(bareboneIds))
        {
            return new ArrayList<>();
        }
        List<PmsBarebone> result = new ArrayList<>();
        for (Long bareboneId : bareboneIds)
        {
            PmsBarebone barebone = bareboneMapper.selectBareboneById(bareboneId);
            if (StringUtils.isNotNull(barebone))
            {
                result.add(barebone);
            }
        }
        return result;
    }
}