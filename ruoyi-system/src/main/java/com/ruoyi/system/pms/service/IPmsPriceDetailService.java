package com.ruoyi.system.pms.service;

import java.util.List;
import com.ruoyi.system.pms.domain.PmsPriceDetail;

/**
 * 价格明细 服务层
 *
 * @author ruoyi
 */
public interface IPmsPriceDetailService
{
    /**
     * 查询价格明细
     *
     * @param detailId 明细ID
     * @return 价格明细
     */
    public PmsPriceDetail selectPriceDetailById(Long detailId);

    /**
     * 查询价格明细列表
     *
     * @param pmsPriceDetail 价格明细
     * @return 价格明细集合
     */
    public List<PmsPriceDetail> selectPriceDetailList(PmsPriceDetail pmsPriceDetail);

    /**
     * 根据价格ID查询明细列表
     *
     * @param priceId 价格ID
     * @return 价格明细集合
     */
    public List<PmsPriceDetail> getByPriceId(Long priceId);

    /**
     * 新增价格明细
     *
     * @param pmsPriceDetail 价格明细
     * @return 结果
     */
    public int insertPriceDetail(PmsPriceDetail pmsPriceDetail);

    /**
     * 批量新增价格明细
     *
     * @param list 价格明细列表
     * @return 结果
     */
    public int batchInsertPriceDetail(List<PmsPriceDetail> list);

    /**
     * 修改价格明细
     *
     * @param pmsPriceDetail 价格明细
     * @return 结果
     */
    public int updatePriceDetail(PmsPriceDetail pmsPriceDetail);

    /**
     * 删除价格明细
     *
     * @param detailId 明细ID
     * @return 结果
     */
    public int deletePriceDetailById(Long detailId);

    /**
     * 根据价格ID删除明细
     *
     * @param priceId 价格ID
     * @return 结果
     */
    public int deleteByPriceId(Long priceId);

    /**
     * 批量删除价格明细
     *
     * @param detailIds 需要删除的数据ID
     * @return 结果
     */
    public int deletePriceDetailByIds(Long[] detailIds);
}