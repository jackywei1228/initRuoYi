package com.ruoyi.system.pms.mapper;

import java.util.List;
import com.ruoyi.system.pms.domain.PmsAccessoryValue;

/**
 * 配件值 数据层
 *
 * @author ruoyi
 */
public interface PmsAccessoryValueMapper
{
    /**
     * 查询配件值
     *
     * @param valueId 配件值ID
     * @return 配件值
     */
    public PmsAccessoryValue selectAccessoryValueById(Long valueId);

    /**
     * 查询配件值列表
     *
     * @param pmsAccessoryValue 配件值
     * @return 配件值集合
     */
    public List<PmsAccessoryValue> selectAccessoryValueList(PmsAccessoryValue pmsAccessoryValue);

    /**
     * 根据类型ID查询配件值列表
     *
     * @param typeId 类型ID
     * @return 配件值集合
     */
    public List<PmsAccessoryValue> selectByTypeId(Long typeId);

    /**
     * 新增配件值
     *
     * @param pmsAccessoryValue 配件值
     * @return 结果
     */
    public int insertAccessoryValue(PmsAccessoryValue pmsAccessoryValue);

    /**
     * 修改配件值
     *
     * @param pmsAccessoryValue 配件值
     * @return 结果
     */
    public int updateAccessoryValue(PmsAccessoryValue pmsAccessoryValue);

    /**
     * 删除配件值
     *
     * @param valueId 配件值ID
     * @return 结果
     */
    public int deleteAccessoryValueById(Long valueId);

    /**
     * 批量删除配件值
     *
     * @param valueIds 需要删除的数据ID
     * @return 结果
     */
    public int deleteAccessoryValueByIds(Long[] valueIds);
}