package com.ruoyi.system.pms.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ruoyi.common.constant.UserConstants;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.system.pms.domain.PmsAccessoryType;
import com.ruoyi.system.pms.mapper.PmsAccessoryTypeMapper;
import com.ruoyi.system.pms.service.IPmsAccessoryTypeService;

/**
 * 配件类型 服务层处理
 *
 * @author ruoyi
 */
@Service
public class PmsAccessoryTypeServiceImpl implements IPmsAccessoryTypeService
{
    @Autowired
    private PmsAccessoryTypeMapper accessoryTypeMapper;

    /**
     * 查询配件类型
     *
     * @param typeId 配件类型ID
     * @return 配件类型
     */
    @Override
    public PmsAccessoryType selectAccessoryTypeById(Long typeId)
    {
        return accessoryTypeMapper.selectAccessoryTypeById(typeId);
    }

    /**
     * 查询配件类型列表
     *
     * @param pmsAccessoryType 配件类型
     * @return 配件类型
     */
    @Override
    public List<PmsAccessoryType> selectAccessoryTypeList(PmsAccessoryType pmsAccessoryType)
    {
        return accessoryTypeMapper.selectAccessoryTypeList(pmsAccessoryType);
    }

    /**
     * 新增配件类型
     *
     * @param pmsAccessoryType 配件类型
     * @return 结果
     */
    @Override
    @Transactional
    public int insertAccessoryType(PmsAccessoryType pmsAccessoryType)
    {
        pmsAccessoryType.setCreateTime(DateUtils.getNowDate());
        return accessoryTypeMapper.insertAccessoryType(pmsAccessoryType);
    }

    /**
     * 修改配件类型
     *
     * @param pmsAccessoryType 配件类型
     * @return 结果
     */
    @Override
    @Transactional
    public int updateAccessoryType(PmsAccessoryType pmsAccessoryType)
    {
        pmsAccessoryType.setUpdateTime(DateUtils.getNowDate());
        return accessoryTypeMapper.updateAccessoryType(pmsAccessoryType);
    }

    /**
     * 删除配件类型
     *
     * @param typeId 配件类型ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteAccessoryTypeById(Long typeId)
    {
        return accessoryTypeMapper.deleteAccessoryTypeById(typeId);
    }

    /**
     * 批量删除配件类型
     *
     * @param typeIds 需要删除的数据ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteAccessoryTypeByIds(Long[] typeIds)
    {
        return accessoryTypeMapper.deleteAccessoryTypeByIds(typeIds);
    }

    /**
     * 校验类型编码是否唯一
     *
     * @param pmsAccessoryType 配件类型
     * @return 结果
     */
    @Override
    public boolean checkTypeCodeUnique(PmsAccessoryType pmsAccessoryType)
    {
        Long typeId = StringUtils.isNull(pmsAccessoryType.getTypeId()) ? -1L : pmsAccessoryType.getTypeId();
        PmsAccessoryType info = accessoryTypeMapper.checkTypeCodeUnique(pmsAccessoryType.getTypeCode());
        if (StringUtils.isNotNull(info) && info.getTypeId().longValue() != typeId.longValue())
        {
            return UserConstants.NOT_UNIQUE;
        }
        return UserConstants.UNIQUE;
    }
}