package com.ruoyi.system.pms.service.impl;

import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.system.pms.domain.PmsExchangeRate;
import com.ruoyi.system.pms.mapper.PmsExchangeRateMapper;
import com.ruoyi.system.pms.service.IPmsExchangeRateService;

/**
 * 汇率 服务层处理
 *
 * @author ruoyi
 */
@Service
public class PmsExchangeRateServiceImpl implements IPmsExchangeRateService
{
    @Autowired
    private PmsExchangeRateMapper exchangeRateMapper;

    /**
     * 查询汇率
     *
     * @param rateId 汇率ID
     * @return 汇率
     */
    @Override
    public PmsExchangeRate selectExchangeRateById(Long rateId)
    {
        return exchangeRateMapper.selectExchangeRateById(rateId);
    }

    /**
     * 查询汇率列表
     *
     * @param pmsExchangeRate 汇率
     * @return 汇率
     */
    @Override
    public List<PmsExchangeRate> selectExchangeRateList(PmsExchangeRate pmsExchangeRate)
    {
        return exchangeRateMapper.selectExchangeRateList(pmsExchangeRate);
    }

    /**
     * 获取最新汇率
     *
     * @param currencyPair 货币对
     * @return 汇率
     */
    @Override
    public PmsExchangeRate getLatestRate(String currencyPair)
    {
        return exchangeRateMapper.selectLatestRate(currencyPair);
    }

    /**
     * 获取历史汇率列表
     *
     * @param currencyPair 货币对
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 汇率集合
     */
    @Override
    public List<PmsExchangeRate> getHistoryRates(String currencyPair, Date startDate, Date endDate)
    {
        return exchangeRateMapper.selectHistoryRates(currencyPair, startDate, endDate);
    }

    /**
     * 新增汇率
     *
     * @param pmsExchangeRate 汇率
     * @return 结果
     */
    @Override
    @Transactional
    public int insertExchangeRate(PmsExchangeRate pmsExchangeRate)
    {
        pmsExchangeRate.setCreateTime(DateUtils.getNowDate());
        return exchangeRateMapper.insertExchangeRate(pmsExchangeRate);
    }

    /**
     * 修改汇率
     *
     * @param pmsExchangeRate 汇率
     * @return 结果
     */
    @Override
    @Transactional
    public int updateExchangeRate(PmsExchangeRate pmsExchangeRate)
    {
        pmsExchangeRate.setUpdateTime(DateUtils.getNowDate());
        return exchangeRateMapper.updateExchangeRate(pmsExchangeRate);
    }

    /**
     * 删除汇率
     *
     * @param rateId 汇率ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteExchangeRateById(Long rateId)
    {
        return exchangeRateMapper.deleteExchangeRateById(rateId);
    }

    /**
     * 批量删除汇率
     *
     * @param rateIds 需要删除的数据ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteExchangeRateByIds(Long[] rateIds)
    {
        return exchangeRateMapper.deleteExchangeRateByIds(rateIds);
    }
}