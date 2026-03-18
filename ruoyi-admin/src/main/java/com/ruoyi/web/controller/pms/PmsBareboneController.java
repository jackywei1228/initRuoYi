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
import com.ruoyi.system.pms.domain.PmsBarebone;
import com.ruoyi.system.pms.domain.PmsBareboneAccessory;
import com.ruoyi.system.pms.service.IPmsBareboneService;

/**
 * 基础型号(SPU)Controller
 *
 * @author ruoyi
 */
@RestController
@RequestMapping("/pms/barebone")
public class PmsBareboneController extends BaseController
{
    @Autowired
    private IPmsBareboneService pmsBareboneService;

    /**
     * 查询基础型号列表
     */
    @PreAuthorize("@ss.hasPermi('pms:barebone:list')")
    @GetMapping("/list")
    public TableDataInfo list(PmsBarebone pmsBarebone)
    {
        startPage();
        List<PmsBarebone> list = pmsBareboneService.selectBareboneList(pmsBarebone);
        return getDataTable(list);
    }

    /**
     * 导出基础型号列表
     */
    @PreAuthorize("@ss.hasPermi('pms:barebone:export')")
    @Log(title = "基础型号管理", businessType = BusinessType.EXPORT)
    @PostMapping("/export")
    public void export(HttpServletResponse response, PmsBarebone pmsBarebone)
    {
        List<PmsBarebone> list = pmsBareboneService.selectBareboneList(pmsBarebone);
        ExcelUtil<PmsBarebone> util = new ExcelUtil<PmsBarebone>(PmsBarebone.class);
        util.exportExcel(response, list, "基础型号数据");
    }

    /**
     * 获取基础型号详细信息
     */
    @PreAuthorize("@ss.hasPermi('pms:barebone:query')")
    @GetMapping(value = "/{bareboneId}")
    public AjaxResult getInfo(@PathVariable("bareboneId") Long bareboneId)
    {
        return success(pmsBareboneService.selectBareboneById(bareboneId));
    }

    /**
     * 新增基础型号
     */
    @PreAuthorize("@ss.hasPermi('pms:barebone:add')")
    @Log(title = "基础型号管理", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody PmsBarebone pmsBarebone)
    {
        if (!pmsBareboneService.checkModelNameUnique(pmsBarebone))
        {
            return error("新增基础型号'" + pmsBarebone.getModelName() + "'失败，型号名称已存在");
        }
        pmsBarebone.setCreateBy(getUsername());
        return toAjax(pmsBareboneService.insertBarebone(pmsBarebone));
    }

    /**
     * 修改基础型号
     */
    @PreAuthorize("@ss.hasPermi('pms:barebone:edit')")
    @Log(title = "基础型号管理", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody PmsBarebone pmsBarebone)
    {
        if (!pmsBareboneService.checkModelNameUnique(pmsBarebone))
        {
            return error("修改基础型号'" + pmsBarebone.getModelName() + "'失败，型号名称已存在");
        }
        pmsBarebone.setUpdateBy(getUsername());
        return toAjax(pmsBareboneService.updateBarebone(pmsBarebone));
    }

    /**
     * 删除基础型号
     */
    @PreAuthorize("@ss.hasPermi('pms:barebone:remove')")
    @Log(title = "基础型号管理", businessType = BusinessType.DELETE)
    @DeleteMapping("/{bareboneIds}")
    public AjaxResult remove(@PathVariable Long[] bareboneIds)
    {
        return toAjax(pmsBareboneService.deleteBareboneByIds(bareboneIds));
    }

    /**
     * 获取基础型号的配件列表
     */
    @PreAuthorize("@ss.hasPermi('pms:barebone:query')")
    @GetMapping("/{bareboneId}/accessories")
    public AjaxResult getAccessories(@PathVariable("bareboneId") Long bareboneId)
    {
        return success(pmsBareboneService.getAccessories(bareboneId));
    }

    /**
     * 绑定配件到基础型号
     */
    @PreAuthorize("@ss.hasPermi('pms:barebone:edit')")
    @Log(title = "基础型号管理", businessType = BusinessType.UPDATE)
    @PostMapping("/{bareboneId}/accessories")
    public AjaxResult bindAccessories(@PathVariable("bareboneId") Long bareboneId,
            @RequestBody List<PmsBareboneAccessory> accessories)
    {
        return toAjax(pmsBareboneService.bindAccessories(bareboneId, accessories));
    }

    /**
     * 比较多个基础型号
     */
    @PreAuthorize("@ss.hasPermi('pms:barebone:list')")
    @PostMapping("/compare")
    public AjaxResult compare(@RequestBody Long[] bareboneIds)
    {
        return success(pmsBareboneService.compareBarebones(bareboneIds));
    }
}