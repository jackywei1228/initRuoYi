package com.ruoyi.system.pms.mapper;

import java.util.List;
import com.ruoyi.system.pms.domain.PmsBarebone;

/**
 * 基础型号(SPU) 数据层
 *
 * @author ruoyi
 */
public interface PmsBareboneMapper
{
    /**
     * 查询基础型号
     *
     * @param bareboneId 基础型号ID
     * @return 基础型号
     */
    public PmsBarebone selectBareboneById(Long bareboneId);

    /**
     * 查询基础型号列表
     *
     * @param pmsBarebone 基础型号
     * @return 基础型号集合
     */
    public List<PmsBarebone> selectBareboneList(PmsBarebone pmsBarebone);

    /**
     * 新增基础型号
     *
     * @param pmsBarebone 基础型号
     * @return 结果
     */
    public int insertBarebone(PmsBarebone pmsBarebone);

    /**
     * 修改基础型号
     *
     * @param pmsBarebone 基础型号
     * @return 结果
     */
    public int updateBarebone(PmsBarebone pmsBarebone);

    /**
     * 删除基础型号
     *
     * @param bareboneId 基础型号ID
     * @return 结果
     */
    public int deleteBareboneById(Long bareboneId);

    /**
     * 批量删除基础型号
     *
     * @param bareboneIds 需要删除的数据ID
     * @return 结果
     */
    public int deleteBareboneByIds(Long[] bareboneIds);

    /**
     * 校验型号名称是否唯一
     *
     * @param modelName 型号名称
     * @return 结果
     */
    public PmsBarebone checkModelNameUnique(String modelName);
}