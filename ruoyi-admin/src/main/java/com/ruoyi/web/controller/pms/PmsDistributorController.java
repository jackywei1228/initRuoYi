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
import com.ruoyi.system.pms.domain.PmsDistributor;
import com.ruoyi.system.pms.domain.PmsDistributorLevel;
import com.ruoyi.system.pms.service.IPmsDistributorService;
import com.ruoyi.system.pms.service.IPmsDistributorLevelService;

/**
 * 经销商管理Controller
 *
 * @author ruoyi
 */
@RestController
@RequestMapping("/pms/distributor")
public class PmsDistributorController extends BaseController
{
    @Autowired
    private IPmsDistributorService distributorService;

    @Autowired
    private IPmsDistributorLevelService distributorLevelService;

    // ==================== 经销商等级相关接口 ====================

    /**
     * 查询经销商等级列表
     */
    @PreAuthorize("@ss.hasPermi('pms:distributor:list')")
    @GetMapping("/level/list")
    public TableDataInfo levelList(PmsDistributorLevel pmsDistributorLevel)
    {
        startPage();
        List<PmsDistributorLevel> list = distributorLevelService.selectDistributorLevelList(pmsDistributorLevel);
        return getDataTable(list);
    }

    /**
     * 获取经销商等级详细信息
     */
    @PreAuthorize("@ss.hasPermi('pms:distributor:query')")
    @GetMapping(value = "/level/{levelId}")
    public AjaxResult getLevelInfo(@PathVariable("levelId") Long levelId)
    {
        return success(distributorLevelService.selectDistributorLevelById(levelId));
    }

    /**
     * 新增经销商等级
     */
    @PreAuthorize("@ss.hasPermi('pms:distributor:add')")
    @Log(title = "经销商等级管理", businessType = BusinessType.INSERT)
    @PostMapping("/level")
    public AjaxResult addLevel(@Validated @RequestBody PmsDistributorLevel pmsDistributorLevel)
    {
        if (!distributorLevelService.checkLevelNameUnique(pmsDistributorLevel))
        {
            return error("新增经销商等级'" + pmsDistributorLevel.getLevelName() + "'失败，等级名称已存在");
        }
        pmsDistributorLevel.setCreateBy(getUsername());
        return toAjax(distributorLevelService.insertDistributorLevel(pmsDistributorLevel));
    }

    /**
     * 修改经销商等级
     */
    @PreAuthorize("@ss.hasPermi('pms:distributor:edit')")
    @Log(title = "经销商等级管理", businessType = BusinessType.UPDATE)
    @PutMapping("/level")
    public AjaxResult editLevel(@Validated @RequestBody PmsDistributorLevel pmsDistributorLevel)
    {
        if (!distributorLevelService.checkLevelNameUnique(pmsDistributorLevel))
        {
            return error("修改经销商等级'" + pmsDistributorLevel.getLevelName() + "'失败，等级名称已存在");
        }
        pmsDistributorLevel.setUpdateBy(getUsername());
        return toAjax(distributorLevelService.updateDistributorLevel(pmsDistributorLevel));
    }

    /**
     * 删除经销商等级
     */
    @PreAuthorize("@ss.hasPermi('pms:distributor:remove')")
    @Log(title = "经销商等级管理", businessType = BusinessType.DELETE)
    @DeleteMapping("/level/{levelIds}")
    public AjaxResult removeLevel(@PathVariable Long[] levelIds)
    {
        return toAjax(distributorLevelService.deleteDistributorLevelByIds(levelIds));
    }

    // ==================== 经销商相关接口 ====================

    /**
     * 查询经销商列表
     */
    @PreAuthorize("@ss.hasPermi('pms:distributor:list')")
    @GetMapping("/list")
    public TableDataInfo list(PmsDistributor pmsDistributor)
    {
        startPage();
        List<PmsDistributor> list = distributorService.selectDistributorList(pmsDistributor);
        return getDataTable(list);
    }

    /**
     * 根据等级ID查询经销商列表
     */
    @PreAuthorize("@ss.hasPermi('pms:distributor:list')")
    @GetMapping("/byLevel/{levelId}")
    public AjaxResult getByLevel(@PathVariable("levelId") Long levelId)
    {
        return success(distributorService.getByLevelId(levelId));
    }

    /**
     * 获取经销商详细信息
     */
    @PreAuthorize("@ss.hasPermi('pms:distributor:query')")
    @GetMapping(value = "/{distributorId}")
    public AjaxResult getInfo(@PathVariable("distributorId") Long distributorId)
    {
        return success(distributorService.selectDistributorById(distributorId));
    }

    /**
     * 新增经销商
     */
    @PreAuthorize("@ss.hasPermi('pms:distributor:add')")
    @Log(title = "经销商管理", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@Validated @RequestBody PmsDistributor pmsDistributor)
    {
        if (!distributorService.checkCompanyNameUnique(pmsDistributor))
        {
            return error("新增经销商'" + pmsDistributor.getCompanyName() + "'失败，公司名称已存在");
        }
        pmsDistributor.setCreateBy(getUsername());
        return toAjax(distributorService.insertDistributor(pmsDistributor));
    }

    /**
     * 修改经销商
     */
    @PreAuthorize("@ss.hasPermi('pms:distributor:edit')")
    @Log(title = "经销商管理", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@Validated @RequestBody PmsDistributor pmsDistributor)
    {
        if (!distributorService.checkCompanyNameUnique(pmsDistributor))
        {
            return error("修改经销商'" + pmsDistributor.getCompanyName() + "'失败，公司名称已存在");
        }
        pmsDistributor.setUpdateBy(getUsername());
        return toAjax(distributorService.updateDistributor(pmsDistributor));
    }

    /**
     * 删除经销商
     */
    @PreAuthorize("@ss.hasPermi('pms:distributor:remove')")
    @Log(title = "经销商管理", businessType = BusinessType.DELETE)
    @DeleteMapping("/{distributorIds}")
    public AjaxResult remove(@PathVariable Long[] distributorIds)
    {
        return toAjax(distributorService.deleteDistributorByIds(distributorIds));
    }
}