package com.ruoyi.system.pms.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.system.pms.domain.PmsAccessoryValue;
import com.ruoyi.system.pms.mapper.PmsAccessoryValueMapper;
import com.ruoyi.system.pms.service.IPmsAccessoryValueService;

/**
 * 配件值 服务层处理
 *
 * @author ruoyi
 */
@Service
public class PmsAccessoryValueServiceImpl implements IPmsAccessoryValueService
{
    @Autowired
    private PmsAccessoryValueMapper accessoryValueMapper;

    /**
     * 查询配件值
     *
     * @param valueId 配件值ID
     * @return 配件值
     */
    @Override
    public PmsAccessoryValue selectAccessoryValueById(Long valueId)
    {
        return accessoryValueMapper.selectAccessoryValueById(valueId);
    }

    /**
     * 查询配件值列表
     *
     * @param pmsAccessoryValue 配件值
     * @return 配件值
     */
    @Override
    public List<PmsAccessoryValue> selectAccessoryValueList(PmsAccessoryValue pmsAccessoryValue)
    {
        return accessoryValueMapper.selectAccessoryValueList(pmsAccessoryValue);
    }

    /**
     * 根据类型ID查询配件值列表
     *
     * @param typeId 类型ID
     * @return 配件值集合
     */
    @Override
    public List<PmsAccessoryValue> selectByTypeId(Long typeId)
    {
        return accessoryValueMapper.selectByTypeId(typeId);
    }

    /**
     * 新增配件值
     *
     * @param pmsAccessoryValue 配件值
     * @return 结果
     */
    @Override
    @Transactional
    public int insertAccessoryValue(PmsAccessoryValue pmsAccessoryValue)
    {
        pmsAccessoryValue.setCreateTime(DateUtils.getNowDate());
        return accessoryValueMapper.insertAccessoryValue(pmsAccessoryValue);
    }

    /**
     * 修改配件值
     *
     * @param pmsAccessoryValue 配件值
     * @return 结果
     */
    @Override
    @Transactional
    public int updateAccessoryValue(PmsAccessoryValue pmsAccessoryValue)
    {
        pmsAccessoryValue.setUpdateTime(DateUtils.getNowDate());
        return accessoryValueMapper.updateAccessoryValue(pmsAccessoryValue);
    }

    /**
     * 删除配件值
     *
     * @param valueId 配件值ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteAccessoryValueById(Long valueId)
    {
        return accessoryValueMapper.deleteAccessoryValueById(valueId);
    }

    /**
     * 批量删除配件值
     *
     * @param valueIds 需要删除的数据ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteAccessoryValueByIds(Long[] valueIds)
    {
        return accessoryValueMapper.deleteAccessoryValueByIds(valueIds);
    }
}