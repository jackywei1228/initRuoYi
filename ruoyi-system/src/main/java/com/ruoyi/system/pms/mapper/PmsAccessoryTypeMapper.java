package com.ruoyi.system.pms.mapper;

import java.util.List;
import com.ruoyi.system.pms.domain.PmsAccessoryType;

/**
 * 配件类型 数据层
 *
 * @author ruoyi
 */
public interface PmsAccessoryTypeMapper
{
    /**
     * 查询配件类型
     *
     * @param typeId 配件类型ID
     * @return 配件类型
     */
    public PmsAccessoryType selectAccessoryTypeById(Long typeId);

    /**
     * 查询配件类型列表
     *
     * @param pmsAccessoryType 配件类型
     * @return 配件类型集合
     */
    public List<PmsAccessoryType> selectAccessoryTypeList(PmsAccessoryType pmsAccessoryType);

    /**
     * 新增配件类型
     *
     * @param pmsAccessoryType 配件类型
     * @return 结果
     */
    public int insertAccessoryType(PmsAccessoryType pmsAccessoryType);

    /**
     * 修改配件类型
     *
     * @param pmsAccessoryType 配件类型
     * @return 结果
     */
    public int updateAccessoryType(PmsAccessoryType pmsAccessoryType);

    /**
     * 删除配件类型
     *
     * @param typeId 配件类型ID
     * @return 结果
     */
    public int deleteAccessoryTypeById(Long typeId);

    /**
     * 批量删除配件类型
     *
     * @param typeIds 需要删除的数据ID
     * @return 结果
     */
    public int deleteAccessoryTypeByIds(Long[] typeIds);

    /**
     * 校验类型编码是否唯一
     *
     * @param typeCode 类型编码
     * @return 结果
     */
    public PmsAccessoryType checkTypeCodeUnique(String typeCode);
}