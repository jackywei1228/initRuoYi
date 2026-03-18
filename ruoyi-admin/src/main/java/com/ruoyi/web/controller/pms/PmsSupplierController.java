package com.ruoyi.web.controller.pms;

import java.util.List;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.system.pms.domain.PmsSupplier;
import com.ruoyi.system.pms.service.IPmsSupplierService;

/**
 * 供应商Controller
 *
 * @author ruoyi
 */
@RestController
@RequestMapping("/pms/supplier")
public class PmsSupplierController extends BaseController
{
    @Autowired
    private IPmsSupplierService pmsSupplierService;

    /**
     * 查询供应商列表
     */
    @PreAuthorize("@ss.hasPermi('pms:supplier:list')")
    @GetMapping("/list")
    public TableDataInfo list(PmsSupplier pmsSupplier)
    {
        startPage();
        List<PmsSupplier> list = pmsSupplierService.selectSupplierList(pmsSupplier);
        return getDataTable(list);
    }

    /**
     * 导出供应商列表
     */
    @PreAuthorize("@ss.hasPermi('pms:supplier:export')")
    @Log(title = "供应商管理", businessType = BusinessType.EXPORT)
    @PostMapping("/export")
    public void export(HttpServletResponse response, PmsSupplier pmsSupplier)
    {
        List<PmsSupplier> list = pmsSupplierService.selectSupplierList(pmsSupplier);
        ExcelUtil<PmsSupplier> util = new ExcelUtil<PmsSupplier>(PmsSupplier.class);
        util.exportExcel(response, list, "供应商数据");
    }

    /**
     * 获取供应商详细信息
     */
    @PreAuthorize("@ss.hasPermi('pms:supplier:query')")
    @GetMapping(value = "/{supplierId}")
    public AjaxResult getInfo(@PathVariable("supplierId") Long supplierId)
    {
        return success(pmsSupplierService.selectSupplierById(supplierId));
    }

    /**
     * 新增供应商
     */
    @PreAuthorize("@ss.hasPermi('pms:supplier:add')")
    @Log(title = "供应商管理", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody PmsSupplier pmsSupplier)
    {
        if (!pmsSupplierService.checkSupplierNameUnique(pmsSupplier))
        {
            return error("新增供应商'" + pmsSupplier.getSupplierName() + "'失败，供应商名称已存在");
        }
        pmsSupplier.setCreateBy(getUsername());
        return toAjax(pmsSupplierService.insertSupplier(pmsSupplier));
    }

    /**
     * 修改供应商
     */
    @PreAuthorize("@ss.hasPermi('pms:supplier:edit')")
    @Log(title = "供应商管理", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody PmsSupplier pmsSupplier)
    {
        if (!pmsSupplierService.checkSupplierNameUnique(pmsSupplier))
        {
            return error("修改供应商'" + pmsSupplier.getSupplierName() + "'失败，供应商名称已存在");
        }
        pmsSupplier.setUpdateBy(getUsername());
        return toAjax(pmsSupplierService.updateSupplier(pmsSupplier));
    }

    /**
     * 删除供应商
     */
    @PreAuthorize("@ss.hasPermi('pms:supplier:remove')")
    @Log(title = "供应商管理", businessType = BusinessType.DELETE)
    @DeleteMapping("/{supplierIds}")
    public AjaxResult remove(@PathVariable Long[] supplierIds)
    {
        return toAjax(pmsSupplierService.deleteSupplierByIds(supplierIds));
    }
}