package com.ruoyi.system.pms.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ruoyi.system.pms.domain.PmsPriceHistory;
import com.ruoyi.system.pms.mapper.PmsPriceHistoryMapper;
import com.ruoyi.system.pms.service.IPmsPriceHistoryService;

/**
 * 价格历史 服务层处理
 *
 * @author ruoyi
 */
@Service
public class PmsPriceHistoryServiceImpl implements IPmsPriceHistoryService
{
    @Autowired
    private PmsPriceHistoryMapper priceHistoryMapper;

    /**
     * 查询价格历史
     *
     * @param historyId 历史ID
     * @return 价格历史
     */
    @Override
    public PmsPriceHistory selectPriceHistoryById(Long historyId)
    {
        return priceHistoryMapper.selectPriceHistoryById(historyId);
    }

    /**
     * 查询价格历史列表
     *
     * @param pmsPriceHistory 价格历史
     * @return 价格历史
     */
    @Override
    public List<PmsPriceHistory> selectPriceHistoryList(PmsPriceHistory pmsPriceHistory)
    {
        return priceHistoryMapper.selectPriceHistoryList(pmsPriceHistory);
    }

    /**
     * 根据价格ID查询历史列表
     *
     * @param priceId 价格ID
     * @return 价格历史集合
     */
    @Override
    public List<PmsPriceHistory> getByPriceId(Long priceId)
    {
        return priceHistoryMapper.selectByPriceId(priceId);
    }

    /**
     * 新增价格历史
     *
     * @param pmsPriceHistory 价格历史
     * @return 结果
     */
    @Override
    @Transactional
    public int insertPriceHistory(PmsPriceHistory pmsPriceHistory)
    {
        return priceHistoryMapper.insertPriceHistory(pmsPriceHistory);
    }

    /**
     * 修改价格历史
     *
     * @param pmsPriceHistory 价格历史
     * @return 结果
     */
    @Override
    @Transactional
    public int updatePriceHistory(PmsPriceHistory pmsPriceHistory)
    {
        return priceHistoryMapper.updatePriceHistory(pmsPriceHistory);
    }

    /**
     * 删除价格历史
     *
     * @param historyId 历史ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deletePriceHistoryById(Long historyId)
    {
        return priceHistoryMapper.deletePriceHistoryById(historyId);
    }

    /**
     * 批量删除价格历史
     *
     * @param historyIds 需要删除的数据ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deletePriceHistoryByIds(Long[] historyIds)
    {
        return priceHistoryMapper.deletePriceHistoryByIds(historyIds);
    }
}