package com.ruoyi.system.pms.service;

import java.util.List;
import com.ruoyi.system.pms.domain.PmsPriceHistory;

/**
 * 价格历史 服务层
 *
 * @author ruoyi
 */
public interface IPmsPriceHistoryService
{
    /**
     * 查询价格历史
     *
     * @param historyId 历史ID
     * @return 价格历史
     */
    public PmsPriceHistory selectPriceHistoryById(Long historyId);

    /**
     * 查询价格历史列表
     *
     * @param pmsPriceHistory 价格历史
     * @return 价格历史集合
     */
    public List<PmsPriceHistory> selectPriceHistoryList(PmsPriceHistory pmsPriceHistory);

    /**
     * 根据价格ID查询历史列表
     *
     * @param priceId 价格ID
     * @return 价格历史集合
     */
    public List<PmsPriceHistory> getByPriceId(Long priceId);

    /**
     * 新增价格历史
     *
     * @param pmsPriceHistory 价格历史
     * @return 结果
     */
    public int insertPriceHistory(PmsPriceHistory pmsPriceHistory);

    /**
     * 修改价格历史
     *
     * @param pmsPriceHistory 价格历史
     * @return 结果
     */
    public int updatePriceHistory(PmsPriceHistory pmsPriceHistory);

    /**
     * 删除价格历史
     *
     * @param historyId 历史ID
     * @return 结果
     */
    public int deletePriceHistoryById(Long historyId);

    /**
     * 批量删除价格历史
     *
     * @param historyIds 需要删除的数据ID
     * @return 结果
     */
    public int deletePriceHistoryByIds(Long[] historyIds);
}