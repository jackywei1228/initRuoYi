package com.ruoyi.system.pms.mapper;

import java.util.List;
import com.ruoyi.system.pms.domain.PmsPriceMain;

/**
 * 价格主数据 数据层
 *
 * @author ruoyi
 */
public interface PmsPriceMainMapper
{
    /**
     * 查询价格主数据
     *
     * @param priceId 价格ID
     * @return 价格主数据
     */
    public PmsPriceMain selectPriceMainById(Long priceId);

    /**
     * 查询价格主数据列表
     *
     * @param pmsPriceMain 价格主数据
     * @return 价格主数据集合
     */
    public List<PmsPriceMain> selectPriceMainList(PmsPriceMain pmsPriceMain);

    /**
     * 根据SKU ID查询价格列表
     *
     * @param skuId SKU ID
     * @return 价格主数据集合
     */
    public List<PmsPriceMain> selectBySkuId(Long skuId);

    /**
     * 新增价格主数据
     *
     * @param pmsPriceMain 价格主数据
     * @return 结果
     */
    public int insertPriceMain(PmsPriceMain pmsPriceMain);

    /**
     * 修改价格主数据
     *
     * @param pmsPriceMain 价格主数据
     * @return 结果
     */
    public int updatePriceMain(PmsPriceMain pmsPriceMain);

    /**
     * 删除价格主数据
     *
     * @param priceId 价格ID
     * @return 结果
     */
    public int deletePriceMainById(Long priceId);

    /**
     * 批量删除价格主数据
     *
     * @param priceIds 需要删除的数据ID
     * @return 结果
     */
    public int deletePriceMainByIds(Long[] priceIds);
}