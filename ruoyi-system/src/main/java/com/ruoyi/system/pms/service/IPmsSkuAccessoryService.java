package com.ruoyi.system.pms.service;

import java.util.List;
import com.ruoyi.system.pms.domain.PmsSkuAccessory;

/**
 * SKU配件关联 服务层
 *
 * @author ruoyi
 */
public interface IPmsSkuAccessoryService
{
    /**
     * 查询SKU配件关联
     *
     * @param id 主键ID
     * @return SKU配件关联
     */
    public PmsSkuAccessory selectSkuAccessoryById(Long id);

    /**
     * 查询SKU配件关联列表
     *
     * @param pmsSkuAccessory SKU配件关联
     * @return SKU配件关联集合
     */
    public List<PmsSkuAccessory> selectSkuAccessoryList(PmsSkuAccessory pmsSkuAccessory);

    /**
     * 根据SKU ID查询配件关联列表
     *
     * @param skuId SKU ID
     * @return SKU配件关联集合
     */
    public List<PmsSkuAccessory> selectBySkuId(Long skuId);

    /**
     * 新增SKU配件关联
     *
     * @param pmsSkuAccessory SKU配件关联
     * @return 结果
     */
    public int insertSkuAccessory(PmsSkuAccessory pmsSkuAccessory);

    /**
     * 批量新增SKU配件关联
     *
     * @param list SKU配件关联列表
     * @return 结果
     */
    public int batchInsertSkuAccessory(List<PmsSkuAccessory> list);

    /**
     * 修改SKU配件关联
     *
     * @param pmsSkuAccessory SKU配件关联
     * @return 结果
     */
    public int updateSkuAccessory(PmsSkuAccessory pmsSkuAccessory);

    /**
     * 删除SKU配件关联
     *
     * @param id 主键ID
     * @return 结果
     */
    public int deleteSkuAccessoryById(Long id);

    /**
     * 根据SKU ID删除配件关联
     *
     * @param skuId SKU ID
     * @return 结果
     */
    public int deleteBySkuId(Long skuId);

    /**
     * 批量删除SKU配件关联
     *
     * @param ids 需要删除的数据ID
     * @return 结果
     */
    public int deleteSkuAccessoryByIds(Long[] ids);
}