package com.ruoyi.system.pms.mapper;

import java.util.List;
import com.ruoyi.system.pms.domain.PmsSupplier;

/**
 * 供应商 数据层
 *
 * @author ruoyi
 */
public interface PmsSupplierMapper
{
    /**
     * 查询供应商
     *
     * @param supplierId 供应商ID
     * @return 供应商
     */
    public PmsSupplier selectSupplierById(Long supplierId);

    /**
     * 查询供应商列表
     *
     * @param pmsSupplier 供应商
     * @return 供应商集合
     */
    public List<PmsSupplier> selectSupplierList(PmsSupplier pmsSupplier);

    /**
     * 新增供应商
     *
     * @param pmsSupplier 供应商
     * @return 结果
     */
    public int insertSupplier(PmsSupplier pmsSupplier);

    /**
     * 修改供应商
     *
     * @param pmsSupplier 供应商
     * @return 结果
     */
    public int updateSupplier(PmsSupplier pmsSupplier);

    /**
     * 删除供应商
     *
     * @param supplierId 供应商ID
     * @return 结果
     */
    public int deleteSupplierById(Long supplierId);

    /**
     * 批量删除供应商
     *
     * @param supplierIds 需要删除的数据ID
     * @return 结果
     */
    public int deleteSupplierByIds(Long[] supplierIds);

    /**
     * 校验供应商名称是否唯一
     *
     * @param supplierName 供应商名称
     * @return 结果
     */
    public PmsSupplier checkSupplierNameUnique(String supplierName);
}