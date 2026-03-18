package com.ruoyi.system.pms.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ruoyi.system.pms.domain.PmsBareboneAccessory;
import com.ruoyi.system.pms.mapper.PmsBareboneAccessoryMapper;
import com.ruoyi.system.pms.service.IPmsBareboneAccessoryService;

/**
 * SPU配件关联 服务层处理
 *
 * @author ruoyi
 */
@Service
public class PmsBareboneAccessoryServiceImpl implements IPmsBareboneAccessoryService
{
    @Autowired
    private PmsBareboneAccessoryMapper bareboneAccessoryMapper;

    /**
     * 查询SPU配件关联
     *
     * @param id 主键ID
     * @return SPU配件关联
     */
    @Override
    public PmsBareboneAccessory selectBareboneAccessoryById(Long id)
    {
        return bareboneAccessoryMapper.selectBareboneAccessoryById(id);
    }

    /**
     * 查询SPU配件关联列表
     *
     * @param pmsBareboneAccessory SPU配件关联
     * @return SPU配件关联
     */
    @Override
    public List<PmsBareboneAccessory> selectBareboneAccessoryList(PmsBareboneAccessory pmsBareboneAccessory)
    {
        return bareboneAccessoryMapper.selectBareboneAccessoryList(pmsBareboneAccessory);
    }

    /**
     * 根据基础型号ID查询配件关联列表
     *
     * @param bareboneId 基础型号ID
     * @return SPU配件关联集合
     */
    @Override
    public List<PmsBareboneAccessory> selectByBareboneId(Long bareboneId)
    {
        return bareboneAccessoryMapper.selectByBareboneId(bareboneId);
    }

    /**
     * 新增SPU配件关联
     *
     * @param pmsBareboneAccessory SPU配件关联
     * @return 结果
     */
    @Override
    @Transactional
    public int insertBareboneAccessory(PmsBareboneAccessory pmsBareboneAccessory)
    {
        return bareboneAccessoryMapper.insertBareboneAccessory(pmsBareboneAccessory);
    }

    /**
     * 批量新增SPU配件关联
     *
     * @param list SPU配件关联列表
     * @return 结果
     */
    @Override
    @Transactional
    public int batchInsertBareboneAccessory(List<PmsBareboneAccessory> list)
    {
        return bareboneAccessoryMapper.batchInsertBareboneAccessory(list);
    }

    /**
     * 修改SPU配件关联
     *
     * @param pmsBareboneAccessory SPU配件关联
     * @return 结果
     */
    @Override
    @Transactional
    public int updateBareboneAccessory(PmsBareboneAccessory pmsBareboneAccessory)
    {
        return bareboneAccessoryMapper.updateBareboneAccessory(pmsBareboneAccessory);
    }

    /**
     * 删除SPU配件关联
     *
     * @param id 主键ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteBareboneAccessoryById(Long id)
    {
        return bareboneAccessoryMapper.deleteBareboneAccessoryById(id);
    }

    /**
     * 根据基础型号ID删除配件关联
     *
     * @param bareboneId 基础型号ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteByBareboneId(Long bareboneId)
    {
        return bareboneAccessoryMapper.deleteByBareboneId(bareboneId);
    }

    /**
     * 批量删除SPU配件关联
     *
     * @param ids 需要删除的数据ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteBareboneAccessoryByIds(Long[] ids)
    {
        return bareboneAccessoryMapper.deleteBareboneAccessoryByIds(ids);
    }
}