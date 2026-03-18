package com.ruoyi.system.pms.service;

import java.util.List;
import com.ruoyi.system.pms.domain.PmsBarebone;
import com.ruoyi.system.pms.domain.PmsBareboneAccessory;

/**
 * 基础型号(SPU) 服务层
 *
 * @author ruoyi
 */
public interface IPmsBareboneService
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
     * @param pmsBarebone 基础型号
     * @return 结果
     */
    public boolean checkModelNameUnique(PmsBarebone pmsBarebone);

    /**
     * 绑定配件到基础型号
     *
     * @param bareboneId 基础型号ID
     * @param accessories 配件列表
     * @return 结果
     */
    public int bindAccessories(Long bareboneId, List<PmsBareboneAccessory> accessories);

    /**
     * 获取基础型号的配件列表
     *
     * @param bareboneId 基础型号ID
     * @return 配件列表
     */
    public List<PmsBareboneAccessory> getAccessories(Long bareboneId);

    /**
     * 比较多个基础型号
     *
     * @param bareboneIds 基础型号ID数组
     * @return 基础型号列表
     */
    public List<PmsBarebone> compareBarebones(Long[] bareboneIds);
}