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
import com.ruoyi.system.pms.domain.PmsSku;
import com.ruoyi.system.pms.domain.PmsSkuAccessory;
import com.ruoyi.system.pms.service.IPmsSkuService;

/**
 * SKUController
 *
 * @author ruoyi
 */
@RestController
@RequestMapping("/pms/sku")
public class PmsSkuController extends BaseController
{
    @Autowired
    private IPmsSkuService pmsSkuService;

    /**
     * 查询SKU列表
     */
    @PreAuthorize("@ss.hasPermi('pms:sku:list')")
    @GetMapping("/list")
    public TableDataInfo list(PmsSku pmsSku)
    {
        startPage();
        List<PmsSku> list = pmsSkuService.selectSkuList(pmsSku);
        return getDataTable(list);
    }

    /**
     * 导出SKU列表
     */
    @PreAuthorize("@ss.hasPermi('pms:sku:export')")
    @Log(title = "SKU管理", businessType = BusinessType.EXPORT)
    @PostMapping("/export")
    public void export(HttpServletResponse response, PmsSku pmsSku)
    {
        List<PmsSku> list = pmsSkuService.selectSkuList(pmsSku);
        ExcelUtil<PmsSku> util = new ExcelUtil<PmsSku>(PmsSku.class);
        util.exportExcel(response, list, "SKU数据");
    }

    /**
     * 获取SKU详细信息
     */
    @PreAuthorize("@ss.hasPermi('pms:sku:query')")
    @GetMapping(value = "/{skuId}")
    public AjaxResult getInfo(@PathVariable("skuId") Long skuId)
    {
        return success(pmsSkuService.selectSkuById(skuId));
    }

    /**
     * 新增SKU
     */
    @PreAuthorize("@ss.hasPermi('pms:sku:add')")
    @Log(title = "SKU管理", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody PmsSku pmsSku)
    {
        if (!pmsSkuService.checkSkuCodeUnique(pmsSku))
        {
            return error("新增SKU'" + pmsSku.getSkuCode() + "'失败，SKU编码已存在");
        }
        pmsSku.setCreateBy(getUsername());
        return toAjax(pmsSkuService.insertSku(pmsSku));
    }

    /**
     * 修改SKU
     */
    @PreAuthorize("@ss.hasPermi('pms:sku:edit')")
    @Log(title = "SKU管理", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody PmsSku pmsSku)
    {
        if (!pmsSkuService.checkSkuCodeUnique(pmsSku))
        {
            return error("修改SKU'" + pmsSku.getSkuCode() + "'失败，SKU编码已存在");
        }
        pmsSku.setUpdateBy(getUsername());
        return toAjax(pmsSkuService.updateSku(pmsSku));
    }

    /**
     * 删除SKU
     */
    @PreAuthorize("@ss.hasPermi('pms:sku:remove')")
    @Log(title = "SKU管理", businessType = BusinessType.DELETE)
    @DeleteMapping("/{skuIds}")
    public AjaxResult remove(@PathVariable Long[] skuIds)
    {
        return toAjax(pmsSkuService.deleteSkuByIds(skuIds));
    }

    /**
     * 获取SKU配件列表
     */
    @PreAuthorize("@ss.hasPermi('pms:sku:query')")
    @GetMapping("/{skuId}/accessories")
    public AjaxResult getAccessories(@PathVariable("skuId") Long skuId)
    {
        return success(pmsSkuService.getAccessories(skuId));
    }

    /**
     * 更新SKU配件
     */
    @PreAuthorize("@ss.hasPermi('pms:sku:edit')")
    @Log(title = "SKU管理", businessType = BusinessType.UPDATE)
    @PutMapping("/{skuId}/accessories")
    public AjaxResult updateAccessories(@PathVariable("skuId") Long skuId,
            @RequestBody List<PmsSkuAccessory> accessories)
    {
        return toAjax(pmsSkuService.updateAccessories(skuId, accessories));
    }

    /**
     * 生成SKU编码
     */
    @PreAuthorize("@ss.hasPermi('pms:sku:add')")
    @GetMapping("/generateCode/{bareboneId}")
    public AjaxResult generateCode(@PathVariable("bareboneId") Long bareboneId)
    {
        return success(pmsSkuService.generateSkuCode(bareboneId));
    }

    /**
     * 比较多个SKU
     */
    @PreAuthorize("@ss.hasPermi('pms:sku:list')")
    @PostMapping("/compare")
    public AjaxResult compare(@RequestBody Long[] skuIds)
    {
        return success(pmsSkuService.compareSkus(skuIds));
    }
}