package com.ruoyi.system.pms.mapper;

import java.util.List;
import com.ruoyi.system.pms.domain.PmsBareboneAccessory;

/**
 * SPU配件关联 数据层
 *
 * @author ruoyi
 */
public interface PmsBareboneAccessoryMapper
{
    /**
     * 查询SPU配件关联
     *
     * @param id 主键ID
     * @return SPU配件关联
     */
    public PmsBareboneAccessory selectBareboneAccessoryById(Long id);

    /**
     * 查询SPU配件关联列表
     *
     * @param pmsBareboneAccessory SPU配件关联
     * @return SPU配件关联集合
     */
    public List<PmsBareboneAccessory> selectBareboneAccessoryList(PmsBareboneAccessory pmsBareboneAccessory);

    /**
     * 根据基础型号ID查询配件关联列表
     *
     * @param bareboneId 基础型号ID
     * @return SPU配件关联集合
     */
    public List<PmsBareboneAccessory> selectByBareboneId(Long bareboneId);

    /**
     * 新增SPU配件关联
     *
     * @param pmsBareboneAccessory SPU配件关联
     * @return 结果
     */
    public int insertBareboneAccessory(PmsBareboneAccessory pmsBareboneAccessory);

    /**
     * 批量新增SPU配件关联
     *
     * @param list SPU配件关联列表
     * @return 结果
     */
    public int batchInsertBareboneAccessory(List<PmsBareboneAccessory> list);

    /**
     * 修改SPU配件关联
     *
     * @param pmsBareboneAccessory SPU配件关联
     * @return 结果
     */
    public int updateBareboneAccessory(PmsBareboneAccessory pmsBareboneAccessory);

    /**
     * 删除SPU配件关联
     *
     * @param id 主键ID
     * @return 结果
     */
    public int deleteBareboneAccessoryById(Long id);

    /**
     * 根据基础型号ID删除配件关联
     *
     * @param bareboneId 基础型号ID
     * @return 结果
     */
    public int deleteByBareboneId(Long bareboneId);

    /**
     * 批量删除SPU配件关联
     *
     * @param ids 需要删除的数据ID
     * @return 结果
     */
    public int deleteBareboneAccessoryByIds(Long[] ids);
}