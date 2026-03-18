package com.ruoyi.system.pms.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.alibaba.fastjson2.JSON;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.common.utils.SecurityUtils;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.system.pms.domain.PmsPriceMain;
import com.ruoyi.system.pms.domain.PmsPriceDetail;
import com.ruoyi.system.pms.domain.PmsPriceHistory;
import com.ruoyi.system.pms.mapper.PmsPriceMainMapper;
import com.ruoyi.system.pms.mapper.PmsPriceDetailMapper;
import com.ruoyi.system.pms.mapper.PmsPriceHistoryMapper;
import com.ruoyi.system.pms.service.IPmsPriceMainService;

/**
 * 价格主数据 服务层处理
 *
 * @author ruoyi
 */
@Service
public class PmsPriceMainServiceImpl implements IPmsPriceMainService
{
    @Autowired
    private PmsPriceMainMapper priceMainMapper;

    @Autowired
    private PmsPriceDetailMapper priceDetailMapper;

    @Autowired
    private PmsPriceHistoryMapper priceHistoryMapper;

    /**
     * 查询价格主数据
     *
     * @param priceId 价格ID
     * @return 价格主数据
     */
    @Override
    public PmsPriceMain selectPriceMainById(Long priceId)
    {
        return priceMainMapper.selectPriceMainById(priceId);
    }

    /**
     * 查询价格主数据列表
     *
     * @param pmsPriceMain 价格主数据
     * @return 价格主数据
     */
    @Override
    public List<PmsPriceMain> selectPriceMainList(PmsPriceMain pmsPriceMain)
    {
        return priceMainMapper.selectPriceMainList(pmsPriceMain);
    }

    /**
     * 根据SKU ID查询价格列表
     *
     * @param skuId SKU ID
     * @return 价格主数据集合
     */
    @Override
    public List<PmsPriceMain> getBySkuId(Long skuId)
    {
        return priceMainMapper.selectBySkuId(skuId);
    }

    /**
     * 新增价格主数据
     *
     * @param pmsPriceMain 价格主数据
     * @return 结果
     */
    @Override
    @Transactional
    public int insertPriceMain(PmsPriceMain pmsPriceMain)
    {
        pmsPriceMain.setCreateTime(DateUtils.getNowDate());
        return priceMainMapper.insertPriceMain(pmsPriceMain);
    }

    /**
     * 修改价格主数据
     *
     * @param pmsPriceMain 价格主数据
     * @return 结果
     */
    @Override
    @Transactional
    public int updatePriceMain(PmsPriceMain pmsPriceMain)
    {
        pmsPriceMain.setUpdateTime(DateUtils.getNowDate());
        return priceMainMapper.updatePriceMain(pmsPriceMain);
    }

    /**
     * 删除价格主数据
     *
     * @param priceId 价格ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deletePriceMainById(Long priceId)
    {
        // 删除关联的明细
        priceDetailMapper.deleteByPriceId(priceId);
        return priceMainMapper.deletePriceMainById(priceId);
    }

    /**
     * 批量删除价格主数据
     *
     * @param priceIds 需要删除的数据ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deletePriceMainByIds(Long[] priceIds)
    {
        // 删除关联的明细
        for (Long priceId : priceIds)
        {
            priceDetailMapper.deleteByPriceId(priceId);
        }
        return priceMainMapper.deletePriceMainByIds(priceIds);
    }

    /**
     * 计算价格
     *
     * @param price 价格主数据
     * @param details 价格明细列表
     */
    @Override
    public void calculatePrice(PmsPriceMain price, List<PmsPriceDetail> details)
    {
        // 获取基础数据
        BigDecimal supplierBasePriceUsd = price.getSupplierBasePriceUsd() != null ? price.getSupplierBasePriceUsd() : BigDecimal.ZERO;
        BigDecimal exchangeRate = price.getExchangeRateUsdAud() != null ? price.getExchangeRateUsdAud() : BigDecimal.ONE;
        BigDecimal dbpEx = price.getDbpExAud() != null ? price.getDbpExAud() : BigDecimal.ZERO;
        BigDecimal rrpInc = price.getRrpIncAud() != null ? price.getRrpIncAud() : BigDecimal.ZERO;

        // 计算总加价金额(USD) - 从SKU中获取
        BigDecimal totalAddPriceUsd = BigDecimal.ZERO;

        // 计算各项费用总和(AUD)
        BigDecimal totalFeesAud = BigDecimal.ZERO;
        if (StringUtils.isNotEmpty(details))
        {
            for (PmsPriceDetail detail : details)
            {
                if (detail.getAmountAud() != null)
                {
                    totalFeesAud = totalFeesAud.add(detail.getAmountAud());
                }
            }
        }

        // Total Cost = (Supplier Base Price USD + Total Add Price USD) * Exchange Rate + Sum of all fees (AUD)
        BigDecimal totalCost = (supplierBasePriceUsd.add(totalAddPriceUsd))
                .multiply(exchangeRate)
                .add(totalFeesAud);
        price.setTotalCostAud(totalCost);

        // Profit = DBP - Total Cost
        BigDecimal profit = dbpEx.subtract(totalCost);
        price.setProfitAud(profit);

        // Build Margin = (DBP - Total Cost) / DBP * 100
        if (dbpEx.compareTo(BigDecimal.ZERO) != 0)
        {
            BigDecimal buildMargin = profit.divide(dbpEx, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
            price.setBuildMargin(buildMargin);
        }

        // RRP Margin = (RRP - DBP * 1.1) / RRP * 100
        if (rrpInc.compareTo(BigDecimal.ZERO) != 0)
        {
            BigDecimal rrpMargin = rrpInc.subtract(dbpEx.multiply(new BigDecimal("1.1")))
                    .divide(rrpInc, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
            price.setRrpMargin(rrpMargin);
        }
    }

    /**
     * 保存价格及历史记录
     *
     * @param price 价格主数据
     * @param details 价格明细列表
     */
    @Override
    @Transactional
    public void savePriceWithHistory(PmsPriceMain price, List<PmsPriceDetail> details)
    {
        // 查询是否存在旧价格
        PmsPriceMain oldPrice = null;
        String beforeData = null;
        if (price.getPriceId() != null)
        {
            oldPrice = priceMainMapper.selectPriceMainById(price.getPriceId());
            if (oldPrice != null)
            {
                beforeData = JSON.toJSONString(oldPrice);
            }
        }

        // 计算价格
        calculatePrice(price, details);

        // 保存或更新价格主数据
        if (price.getPriceId() == null)
        {
            price.setCreateTime(DateUtils.getNowDate());
            price.setCreateBy(SecurityUtils.getUsername());
            priceMainMapper.insertPriceMain(price);
        }
        else
        {
            price.setUpdateTime(DateUtils.getNowDate());
            price.setUpdateBy(SecurityUtils.getUsername());
            priceMainMapper.updatePriceMain(price);
        }

        // 删除旧明细并插入新明细
        if (price.getPriceId() != null)
        {
            priceDetailMapper.deleteByPriceId(price.getPriceId());
        }
        if (StringUtils.isNotEmpty(details))
        {
            for (PmsPriceDetail detail : details)
            {
                detail.setPriceId(price.getPriceId());
                detail.setCreateTime(DateUtils.getNowDate());
            }
            priceDetailMapper.batchInsertPriceDetail(details);
        }

        // 创建历史记录
        PmsPriceHistory history = new PmsPriceHistory();
        history.setPriceId(price.getPriceId());
        history.setChangeType(price.getPriceId() == null ? "CREATE" : "UPDATE");
        history.setBeforeData(beforeData);
        history.setAfterData(JSON.toJSONString(price));
        history.setCreateBy(SecurityUtils.getUsername());
        history.setCreateTime(DateUtils.getNowDate());
        priceHistoryMapper.insertPriceHistory(history);
    }
}