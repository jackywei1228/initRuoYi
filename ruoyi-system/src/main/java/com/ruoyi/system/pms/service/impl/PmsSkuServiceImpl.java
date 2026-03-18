package com.ruoyi.system.pms.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ruoyi.common.constant.UserConstants;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.system.pms.domain.PmsSku;
import com.ruoyi.system.pms.domain.PmsSkuAccessory;
import com.ruoyi.system.pms.domain.PmsAccessoryValue;
import com.ruoyi.system.pms.mapper.PmsSkuMapper;
import com.ruoyi.system.pms.mapper.PmsSkuAccessoryMapper;
import com.ruoyi.system.pms.mapper.PmsAccessoryValueMapper;
import com.ruoyi.system.pms.service.IPmsSkuService;

/**
 * SKU 服务层处理
 *
 * @author ruoyi
 */
@Service
public class PmsSkuServiceImpl implements IPmsSkuService
{
    @Autowired
    private PmsSkuMapper skuMapper;

    @Autowired
    private PmsSkuAccessoryMapper skuAccessoryMapper;

    @Autowired
    private PmsAccessoryValueMapper accessoryValueMapper;

    /**
     * 查询SKU
     *
     * @param skuId SKU ID
     * @return SKU
     */
    @Override
    public PmsSku selectSkuById(Long skuId)
    {
        return skuMapper.selectSkuById(skuId);
    }

    /**
     * 查询SKU列表
     *
     * @param pmsSku SKU
     * @return SKU
     */
    @Override
    public List<PmsSku> selectSkuList(PmsSku pmsSku)
    {
        return skuMapper.selectSkuList(pmsSku);
    }

    /**
     * 新增SKU
     *
     * @param pmsSku SKU
     * @return 结果
     */
    @Override
    @Transactional
    public int insertSku(PmsSku pmsSku)
    {
        pmsSku.setCreateTime(DateUtils.getNowDate());
        return skuMapper.insertSku(pmsSku);
    }

    /**
     * 修改SKU
     *
     * @param pmsSku SKU
     * @return 结果
     */
    @Override
    @Transactional
    public int updateSku(PmsSku pmsSku)
    {
        pmsSku.setUpdateTime(DateUtils.getNowDate());
        return skuMapper.updateSku(pmsSku);
    }

    /**
     * 删除SKU
     *
     * @param skuId SKU ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteSkuById(Long skuId)
    {
        // 删除关联的配件
        skuAccessoryMapper.deleteBySkuId(skuId);
        return skuMapper.deleteSkuById(skuId);
    }

    /**
     * 批量删除SKU
     *
     * @param skuIds 需要删除的数据ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteSkuByIds(Long[] skuIds)
    {
        // 删除关联的配件
        for (Long skuId : skuIds)
        {
            skuAccessoryMapper.deleteBySkuId(skuId);
        }
        return skuMapper.deleteSkuByIds(skuIds);
    }

    /**
     * 校验SKU编码是否唯一
     *
     * @param pmsSku SKU
     * @return 结果
     */
    @Override
    public boolean checkSkuCodeUnique(PmsSku pmsSku)
    {
        Long skuId = StringUtils.isNull(pmsSku.getSkuId()) ? -1L : pmsSku.getSkuId();
        PmsSku info = skuMapper.checkSkuCodeUnique(pmsSku.getSkuCode());
        if (StringUtils.isNotNull(info) && info.getSkuId().longValue() != skuId.longValue())
        {
            return UserConstants.NOT_UNIQUE;
        }
        return UserConstants.UNIQUE;
    }

    /**
     * 更新SKU配件
     *
     * @param skuId SKU ID
     * @param accessories 配件列表
     * @return 结果
     */
    @Override
    @Transactional
    public int updateAccessories(Long skuId, List<PmsSkuAccessory> accessories)
    {
        // 先删除旧的关联
        skuAccessoryMapper.deleteBySkuId(skuId);
        // 再插入新的关联
        if (StringUtils.isNotEmpty(accessories))
        {
            for (PmsSkuAccessory accessory : accessories)
            {
                accessory.setSkuId(skuId);
            }
            int result = skuAccessoryMapper.batchInsertSkuAccessory(accessories);
            // 重新计算总加价金额
            calculateTotalAddPrice(skuId);
            return result;
        }
        return 0;
    }

    /**
     * 获取SKU配件列表
     *
     * @param skuId SKU ID
     * @return 配件列表
     */
    @Override
    public List<PmsSkuAccessory> getAccessories(Long skuId)
    {
        return skuAccessoryMapper.selectBySkuId(skuId);
    }

    /**
     * 生成SKU编码
     *
     * @param bareboneId 基础型号ID
     * @return SKU编码
     */
    @Override
    public String generateSkuCode(Long bareboneId)
    {
        // 生成格式: BB{bareboneId}-{时间戳后6位}
        String timestamp = String.valueOf(System.currentTimeMillis());
        String suffix = timestamp.substring(timestamp.length() - 6);
        return "BB" + bareboneId + "-" + suffix;
    }

    /**
     * 计算总加价金额
     *
     * @param skuId SKU ID
     */
    @Override
    @Transactional
    public void calculateTotalAddPrice(Long skuId)
    {
        List<PmsSkuAccessory> accessories = skuAccessoryMapper.selectBySkuId(skuId);
        BigDecimal totalAddPrice = BigDecimal.ZERO;

        if (StringUtils.isNotEmpty(accessories))
        {
            for (PmsSkuAccessory accessory : accessories)
            {
                PmsAccessoryValue value = accessoryValueMapper.selectAccessoryValueById(accessory.getAccessoryValueId());
                if (StringUtils.isNotNull(value) && StringUtils.isNotNull(value.getPriceAddUsd()))
                {
                    totalAddPrice = totalAddPrice.add(value.getPriceAddUsd());
                }
            }
        }

        // 更新SKU的总加价金额
        PmsSku sku = new PmsSku();
        sku.setSkuId(skuId);
        sku.setTotalAddPriceUsd(totalAddPrice);
        skuMapper.updateSku(sku);
    }

    /**
     * 比较多个SKU
     *
     * @param skuIds SKU ID数组
     * @return SKU列表
     */
    @Override
    public List<PmsSku> compareSkus(Long[] skuIds)
    {
        if (StringUtils.isEmpty(skuIds))
        {
            return new ArrayList<>();
        }
        List<PmsSku> result = new ArrayList<>();
        for (Long skuId : skuIds)
        {
            PmsSku sku = skuMapper.selectSkuById(skuId);
            if (StringUtils.isNotNull(sku))
            {
                result.add(sku);
            }
        }
        return result;
    }
}