package com.ruoyi.system.pms.mapper;

import java.util.Date;
import java.util.List;
import org.apache.ibatis.annotations.Param;
import com.ruoyi.system.pms.domain.PmsExchangeRate;

/**
 * 汇率 数据层
 *
 * @author ruoyi
 */
public interface PmsExchangeRateMapper
{
    /**
     * 查询汇率
     *
     * @param rateId 汇率ID
     * @return 汇率
     */
    public PmsExchangeRate selectExchangeRateById(Long rateId);

    /**
     * 查询汇率列表
     *
     * @param pmsExchangeRate 汇率
     * @return 汇率集合
     */
    public List<PmsExchangeRate> selectExchangeRateList(PmsExchangeRate pmsExchangeRate);

    /**
     * 查询最新汇率
     *
     * @param currencyPair 货币对
     * @return 汇率
     */
    public PmsExchangeRate selectLatestRate(String currencyPair);

    /**
     * 查询历史汇率列表
     *
     * @param currencyPair 货币对
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 汇率集合
     */
    public List<PmsExchangeRate> selectHistoryRates(@Param("currencyPair") String currencyPair, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    /**
     * 新增汇率
     *
     * @param pmsExchangeRate 汇率
     * @return 结果
     */
    public int insertExchangeRate(PmsExchangeRate pmsExchangeRate);

    /**
     * 修改汇率
     *
     * @param pmsExchangeRate 汇率
     * @return 结果
     */
    public int updateExchangeRate(PmsExchangeRate pmsExchangeRate);

    /**
     * 删除汇率
     *
     * @param rateId 汇率ID
     * @return 结果
     */
    public int deleteExchangeRateById(Long rateId);

    /**
     * 批量删除汇率
     *
     * @param rateIds 需要删除的数据ID
     * @return 结果
     */
    public int deleteExchangeRateByIds(Long[] rateIds);
}