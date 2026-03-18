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
import com.ruoyi.system.pms.domain.PmsAccessoryType;
import com.ruoyi.system.pms.domain.PmsAccessoryValue;
import com.ruoyi.system.pms.service.IPmsAccessoryTypeService;
import com.ruoyi.system.pms.service.IPmsAccessoryValueService;

/**
 * 配件管理Controller
 *
 * @author ruoyi
 */
@RestController
@RequestMapping("/pms/accessory")
public class PmsAccessoryController extends BaseController
{
    @Autowired
    private IPmsAccessoryTypeService accessoryTypeService;

    @Autowired
    private IPmsAccessoryValueService accessoryValueService;

    // ==================== 配件类型相关接口 ====================

    /**
     * 查询配件类型列表
     */
    @PreAuthorize("@ss.hasPermi('pms:accessory:list')")
    @GetMapping("/type/list")
    public TableDataInfo typeList(PmsAccessoryType pmsAccessoryType)
    {
        startPage();
        List<PmsAccessoryType> list = accessoryTypeService.selectAccessoryTypeList(pmsAccessoryType);
        return getDataTable(list);
    }

    /**
     * 获取配件类型详细信息
     */
    @PreAuthorize("@ss.hasPermi('pms:accessory:query')")
    @GetMapping(value = "/type/{typeId}")
    public AjaxResult getTypeInfo(@PathVariable("typeId") Long typeId)
    {
        return success(accessoryTypeService.selectAccessoryTypeById(typeId));
    }

    /**
     * 新增配件类型
     */
    @PreAuthorize("@ss.hasPermi('pms:accessory:add')")
    @Log(title = "配件类型管理", businessType = BusinessType.INSERT)
    @PostMapping("/type")
    public AjaxResult addType(@Validated @RequestBody PmsAccessoryType pmsAccessoryType)
    {
        if (!accessoryTypeService.checkTypeCodeUnique(pmsAccessoryType))
        {
            return error("新增配件类型'" + pmsAccessoryType.getTypeName() + "'失败，类型编码已存在");
        }
        pmsAccessoryType.setCreateBy(getUsername());
        return toAjax(accessoryTypeService.insertAccessoryType(pmsAccessoryType));
    }

    /**
     * 修改配件类型
     */
    @PreAuthorize("@ss.hasPermi('pms:accessory:edit')")
    @Log(title = "配件类型管理", businessType = BusinessType.UPDATE)
    @PutMapping("/type")
    public AjaxResult editType(@Validated @RequestBody PmsAccessoryType pmsAccessoryType)
    {
        if (!accessoryTypeService.checkTypeCodeUnique(pmsAccessoryType))
        {
            return error("修改配件类型'" + pmsAccessoryType.getTypeName() + "'失败，类型编码已存在");
        }
        pmsAccessoryType.setUpdateBy(getUsername());
        return toAjax(accessoryTypeService.updateAccessoryType(pmsAccessoryType));
    }

    /**
     * 删除配件类型
     */
    @PreAuthorize("@ss.hasPermi('pms:accessory:remove')")
    @Log(title = "配件类型管理", businessType = BusinessType.DELETE)
    @DeleteMapping("/type/{typeIds}")
    public AjaxResult removeType(@PathVariable Long[] typeIds)
    {
        return toAjax(accessoryTypeService.deleteAccessoryTypeByIds(typeIds));
    }

    // ==================== 配件值相关接口 ====================

    /**
     * 查询配件值列表
     */
    @PreAuthorize("@ss.hasPermi('pms:accessory:list')")
    @GetMapping("/value/list")
    public TableDataInfo valueList(PmsAccessoryValue pmsAccessoryValue)
    {
        startPage();
        List<PmsAccessoryValue> list = accessoryValueService.selectAccessoryValueList(pmsAccessoryValue);
        return getDataTable(list);
    }

    /**
     * 根据类型ID查询配件值列表
     */
    @PreAuthorize("@ss.hasPermi('pms:accessory:list')")
    @GetMapping("/value/byType/{typeId}")
    public AjaxResult getValuesByType(@PathVariable("typeId") Long typeId)
    {
        return success(accessoryValueService.selectByTypeId(typeId));
    }

    /**
     * 获取配件值详细信息
     */
    @PreAuthorize("@ss.hasPermi('pms:accessory:query')")
    @GetMapping(value = "/value/{valueId}")
    public AjaxResult getValueInfo(@PathVariable("valueId") Long valueId)
    {
        return success(accessoryValueService.selectAccessoryValueById(valueId));
    }

    /**
     * 新增配件值
     */
    @PreAuthorize("@ss.hasPermi('pms:accessory:add')")
    @Log(title = "配件值管理", businessType = BusinessType.INSERT)
    @PostMapping("/value")
    public AjaxResult addValue(@Validated @RequestBody PmsAccessoryValue pmsAccessoryValue)
    {
        pmsAccessoryValue.setCreateBy(getUsername());
        return toAjax(accessoryValueService.insertAccessoryValue(pmsAccessoryValue));
    }

    /**
     * 修改配件值
     */
    @PreAuthorize("@ss.hasPermi('pms:accessory:edit')")
    @Log(title = "配件值管理", businessType = BusinessType.UPDATE)
    @PutMapping("/value")
    public AjaxResult editValue(@Validated @RequestBody PmsAccessoryValue pmsAccessoryValue)
    {
        pmsAccessoryValue.setUpdateBy(getUsername());
        return toAjax(accessoryValueService.updateAccessoryValue(pmsAccessoryValue));
    }

    /**
     * 删除配件值
     */
    @PreAuthorize("@ss.hasPermi('pms:accessory:remove')")
    @Log(title = "配件值管理", businessType = BusinessType.DELETE)
    @DeleteMapping("/value/{valueIds}")
    public AjaxResult removeValue(@PathVariable Long[] valueIds)
    {
        return toAjax(accessoryValueService.deleteAccessoryValueByIds(valueIds));
    }
}