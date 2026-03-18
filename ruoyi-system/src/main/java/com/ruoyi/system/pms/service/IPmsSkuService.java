package com.ruoyi.system.pms.service;

import java.util.List;
import com.ruoyi.system.pms.domain.PmsSku;
import com.ruoyi.system.pms.domain.PmsSkuAccessory;

/**
 * SKU 服务层
 *
 * @author ruoyi
 */
public interface IPmsSkuService
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
     * @param pmsSku SKU
     * @return 结果
     */
    public boolean checkSkuCodeUnique(PmsSku pmsSku);

    /**
     * 更新SKU配件
     *
     * @param skuId SKU ID
     * @param accessories 配件列表
     * @return 结果
     */
    public int updateAccessories(Long skuId, List<PmsSkuAccessory> accessories);

    /**
     * 获取SKU配件列表
     *
     * @param skuId SKU ID
     * @return 配件列表
     */
    public List<PmsSkuAccessory> getAccessories(Long skuId);

    /**
     * 生成SKU编码
     *
     * @param bareboneId 基础型号ID
     * @return SKU编码
     */
    public String generateSkuCode(Long bareboneId);

    /**
     * 计算总加价金额
     *
     * @param skuId SKU ID
     */
    public void calculateTotalAddPrice(Long skuId);

    /**
     * 比较多个SKU
     *
     * @param skuIds SKU ID数组
     * @return SKU列表
     */
    public List<PmsSku> compareSkus(Long[] skuIds);
}