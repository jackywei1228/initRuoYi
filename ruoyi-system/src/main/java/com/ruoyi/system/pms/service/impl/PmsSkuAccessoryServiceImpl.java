package com.ruoyi.system.pms.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ruoyi.system.pms.domain.PmsSkuAccessory;
import com.ruoyi.system.pms.mapper.PmsSkuAccessoryMapper;
import com.ruoyi.system.pms.service.IPmsSkuAccessoryService;

/**
 * SKU配件关联 服务层处理
 *
 * @author ruoyi
 */
@Service
public class PmsSkuAccessoryServiceImpl implements IPmsSkuAccessoryService
{
    @Autowired
    private PmsSkuAccessoryMapper skuAccessoryMapper;

    /**
     * 查询SKU配件关联
     *
     * @param id 主键ID
     * @return SKU配件关联
     */
    @Override
    public PmsSkuAccessory selectSkuAccessoryById(Long id)
    {
        return skuAccessoryMapper.selectSkuAccessoryById(id);
    }

    /**
     * 查询SKU配件关联列表
     *
     * @param pmsSkuAccessory SKU配件关联
     * @return SKU配件关联
     */
    @Override
    public List<PmsSkuAccessory> selectSkuAccessoryList(PmsSkuAccessory pmsSkuAccessory)
    {
        return skuAccessoryMapper.selectSkuAccessoryList(pmsSkuAccessory);
    }

    /**
     * 根据SKU ID查询配件关联列表
     *
     * @param skuId SKU ID
     * @return SKU配件关联集合
     */
    @Override
    public List<PmsSkuAccessory> selectBySkuId(Long skuId)
    {
        return skuAccessoryMapper.selectBySkuId(skuId);
    }

    /**
     * 新增SKU配件关联
     *
     * @param pmsSkuAccessory SKU配件关联
     * @return 结果
     */
    @Override
    @Transactional
    public int insertSkuAccessory(PmsSkuAccessory pmsSkuAccessory)
    {
        return skuAccessoryMapper.insertSkuAccessory(pmsSkuAccessory);
    }

    /**
     * 批量新增SKU配件关联
     *
     * @param list SKU配件关联列表
     * @return 结果
     */
    @Override
    @Transactional
    public int batchInsertSkuAccessory(List<PmsSkuAccessory> list)
    {
        return skuAccessoryMapper.batchInsertSkuAccessory(list);
    }

    /**
     * 修改SKU配件关联
     *
     * @param pmsSkuAccessory SKU配件关联
     * @return 结果
     */
    @Override
    @Transactional
    public int updateSkuAccessory(PmsSkuAccessory pmsSkuAccessory)
    {
        return skuAccessoryMapper.updateSkuAccessory(pmsSkuAccessory);
    }

    /**
     * 删除SKU配件关联
     *
     * @param id 主键ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteSkuAccessoryById(Long id)
    {
        return skuAccessoryMapper.deleteSkuAccessoryById(id);
    }

    /**
     * 根据SKU ID删除配件关联
     *
     * @param skuId SKU ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteBySkuId(Long skuId)
    {
        return skuAccessoryMapper.deleteBySkuId(skuId);
    }

    /**
     * 批量删除SKU配件关联
     *
     * @param ids 需要删除的数据ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteSkuAccessoryByIds(Long[] ids)
    {
        return skuAccessoryMapper.deleteSkuAccessoryByIds(ids);
    }
}