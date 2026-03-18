package com.ruoyi.system.pms.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ruoyi.common.constant.UserConstants;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.system.pms.domain.PmsSupplier;
import com.ruoyi.system.pms.mapper.PmsSupplierMapper;
import com.ruoyi.system.pms.service.IPmsSupplierService;

/**
 * 供应商 服务层处理
 *
 * @author ruoyi
 */
@Service
public class PmsSupplierServiceImpl implements IPmsSupplierService
{
    @Autowired
    private PmsSupplierMapper supplierMapper;

    /**
     * 查询供应商
     *
     * @param supplierId 供应商ID
     * @return 供应商
     */
    @Override
    public PmsSupplier selectSupplierById(Long supplierId)
    {
        return supplierMapper.selectSupplierById(supplierId);
    }

    /**
     * 查询供应商列表
     *
     * @param pmsSupplier 供应商
     * @return 供应商
     */
    @Override
    public List<PmsSupplier> selectSupplierList(PmsSupplier pmsSupplier)
    {
        return supplierMapper.selectSupplierList(pmsSupplier);
    }

    /**
     * 新增供应商
     *
     * @param pmsSupplier 供应商
     * @return 结果
     */
    @Override
    @Transactional
    public int insertSupplier(PmsSupplier pmsSupplier)
    {
        pmsSupplier.setCreateTime(DateUtils.getNowDate());
        return supplierMapper.insertSupplier(pmsSupplier);
    }

    /**
     * 修改供应商
     *
     * @param pmsSupplier 供应商
     * @return 结果
     */
    @Override
    @Transactional
    public int updateSupplier(PmsSupplier pmsSupplier)
    {
        pmsSupplier.setUpdateTime(DateUtils.getNowDate());
        return supplierMapper.updateSupplier(pmsSupplier);
    }

    /**
     * 删除供应商
     *
     * @param supplierId 供应商ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteSupplierById(Long supplierId)
    {
        return supplierMapper.deleteSupplierById(supplierId);
    }

    /**
     * 批量删除供应商
     *
     * @param supplierIds 需要删除的数据ID
     * @return 结果
     */
    @Override
    @Transactional
    public int deleteSupplierByIds(Long[] supplierIds)
    {
        return supplierMapper.deleteSupplierByIds(supplierIds);
    }

    /**
     * 校验供应商名称是否唯一
     *
     * @param pmsSupplier 供应商
     * @return 结果
     */
    @Override
    public boolean checkSupplierNameUnique(PmsSupplier pmsSupplier)
    {
        Long supplierId = StringUtils.isNull(pmsSupplier.getSupplierId()) ? -1L : pmsSupplier.getSupplierId();
        PmsSupplier info = supplierMapper.checkSupplierNameUnique(pmsSupplier.getSupplierName());
        if (StringUtils.isNotNull(info) && info.getSupplierId().longValue() != supplierId.longValue())
        {
            return UserConstants.NOT_UNIQUE;
        }
        return UserConstants.UNIQUE;
    }
}