package com.ruoyi.system.pms.mapper;

import java.util.List;
import com.ruoyi.system.pms.domain.PmsSku;

/**
 * SKU 数据层
 *
 * @author ruoyi
 */
public interface PmsSkuMapper
{
    /**
     * 查询SKU
     *
     * @param skuId SKU ID
     * @return SKU
     */
    public PmsSku selectSkuById(Long skuId);

    /**
     * 查询SKU列表
     *
     * @param pmsSku SKU
     * @return SKU集合
     */
    public List<PmsSku> selectSkuList(PmsSku pmsSku);

    /**
     * 新增SKU
     *
     * @param pmsSku SKU
     * @return 结果
     */
    public int insertSku(PmsSku pmsSku);

    /**
     * 修改SKU
     *
     * @param pmsSku SKU
     * @return 结果
     */
    public int updateSku(PmsSku pmsSku);

    /**
     * 删除SKU
     *
     * @param skuId SKU ID
     * @return 结果
     */
    public int deleteSkuById(Long skuId);

    /**
     * 批量删除SKU
     *
     * @param skuIds 需要删除的数据ID
     * @return 结果
     */
    public int deleteSkuByIds(Long[] skuIds);

    /**
     * 校验SKU编码是否唯一
     *
     * @param skuCode SKU编码
     * @return 结果
     */
    public PmsSku checkSkuCodeUnique(String skuCode);
}