package com.ruoyi.system.pms.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.system.pms.domain.PmsPriceDetail;
import com.ruoyi.system.pms.mapper.PmsPriceDetailMapper;
import com.ruoyi.system.pms.service.IPmsPriceDetailService;

/**
 * 价格明细 服务层处理
 *
 * @author ruoyi
 */
@Service
public class PmsPriceDetailServiceImpl implements IPmsPriceDetailService
{
    @Autowired
    private PmsPriceDetailMapper priceDetailMapper;

    /**
     * 查询价格明细
     *
     * @param detailId 明细ID
     * @return 价格明细
     */
    @Override
    public PmsPriceDetail selectPriceDetailById(Long detailId)
    {
        return priceDetailMapper.selectPriceDetailById(detailId);
    }

    /**
     * 查询价格明细列表
     *
     * @param pmsPriceDetail 价格明细
     * @return 价格明细
     */
    @Override
    public List<PmsPriceDetail> selectPriceDetailList(PmsPriceDetail pmsPriceDetail)
    {
        return priceDetailMapper.selectPriceDetailList(pmsPriceDetail);
    }

    /**
     * 根据价格ID查询明细列表
     *
     * @param priceId 价格ID
     * @return 价格明细集合
     */
    @Override
    public List<PmsPriceDetail> getByPriceId(Long priceId)
    {
        return priceDetailMapper.selectByPriceId(priceId);
    }

    /**
     * 新增价格明细
     *
     * @param pmsPriceDetail 价格明细
     * @return 结果
     */
    @Override
    @Transactional
    public int insertPriceDetail(PmsPriceDetail pmsPriceDetail)
    {
        pmsPriceDetail.setCreateTime(DateUtils.getNowDate());
        return priceDetailMapper.insertPriceDetail(pmsPriceDetail);
    }

    /**
     * 批量新增价格明细
     *
     * @param list 价格明细列表
     * @return 结果
     */
    @Override
    @Transactional
    public int batchInsertPriceDetail(List<PmsPriceDetail> list)
    {
        return priceDetailMapper.batchInsertPriceDetail(list);
    }

    /**
     * 修改价格明细
     *
     * @param pmsPriceDetail 价格明细
     * @return 结果
     */
    @Override
    @Transactional
    public int updatePriceDetail(PmsPriceDetail pmsPriceDetail)
    {
        return priceDetailMapper.updatePriceDetail(pmsPriceDetail);
    }

    /**
     * 删除价格明细
     *
     * @param detailId 明细ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deletePriceDetailById(Long detailId)
    {
        return priceDetailMapper.deletePriceDetailById(detailId);
    }

    /**
     * 根据价格ID删除明细
     *
     * @param priceId 价格ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteByPriceId(Long priceId)
    {
        return priceDetailMapper.deleteByPriceId(priceId);
    }

    /**
     * 批量删除价格明细
     *
     * @param detailIds 需要删除的数据ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deletePriceDetailByIds(Long[] detailIds)
    {
        return priceDetailMapper.deletePriceDetailByIds(detailIds);
    }
}